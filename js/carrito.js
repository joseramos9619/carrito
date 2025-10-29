// Carrito de compras mejorado (productos cargados desde data/products.json)
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const tabla = document.querySelector("#productos");
const vaciar = document.querySelector("#limpiar");
const filas = document.querySelector(".filas");
const cartCount = document.querySelector("#cart-count");
const totalElement = document.querySelector("#total");

let productsById = {};

// Inicializar carrito y cargar productos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  actualizarCarrito();
  loadProducts();

  // Sidebar / hamburger
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('overlay');
  const sidebarClose = document.getElementById('sidebar-close');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const open = document.body.classList.toggle('sidebar-open');
      if (open) overlay.removeAttribute('hidden');
      else overlay.setAttribute('hidden', '');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      document.body.classList.remove('sidebar-open');
      overlay.setAttribute('hidden', '');
    });
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', () => {
      document.body.classList.remove('sidebar-open');
      overlay.setAttribute('hidden', '');
    });
  }
});

// Carga el JSON de productos y renderiza las tarjetas
const loadProducts = async () => {
  try {
    const res = await fetch('data/products.json');
    if (!res.ok) throw new Error('No se pudo cargar data/products.json');
    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    console.error('Error cargando productos:', err);
  }
};

// Renderiza tarjetas conservando la estructura esperada por la app
const renderProducts = (products) => {
  filas.innerHTML = '';
  products.forEach(p => {
    productsById[p.id] = p;

    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta';
    tarjeta.innerHTML = `
      <img class="prod" src="${p.imagen}" alt="${p.nombre}" />
      <h3>${p.nombre}</h3>
      <small></small>
      <div class="price">$${p.precio.toLocaleString('es-CO')}</div>
      <button data-id="${p.id}">Agregar</button>
    `;

    filas.appendChild(tarjeta);
  });
};

// Delegación de eventos para botones "Agregar" en el contenedor de tarjetas
filas.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;
  e.preventDefault();
  const id = btn.dataset.id;
  const p = productsById[id];
  if (!p) return;

  const producto = {
    id: id,
    imagen: p.imagen,
    nombre: p.nombre,
    precio: p.precio,
    cantidad: 1,
  };

  agregarAlCarrito(producto);
});

// Función para agregar producto al carrito
const agregarAlCarrito = (producto) => {
  const productoExistente = carrito.find((item) => item.id === producto.id);

  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push(producto);
  }

  guardarCarrito();
  actualizarCarrito();
};

// Normaliza y parsea una cadena de precio a número
// Ejemplos soportados: "$40.000", "40.000", "1.234,56", "1234.56", "€1.234"
const parsePrice = (str) => {
  if (typeof str === "number") return str;
  if (!str || typeof str !== "string") return 0;

  let s = str.trim();

  // Si contiene ambos separadores, asumimos formato europeo: "1.234,56"
  if (s.indexOf(".") > -1 && s.indexOf(",") > -1) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (s.indexOf(".") > -1 && s.indexOf(",") === -1) {
    // Ambigüedad: si el último grupo tiene 3 dígitos, probablemente sea separador de miles
    const parts = s.split(".");
    const last = parts[parts.length - 1];
    if (last.length === 3) {
      s = s.replace(/\./g, "");
    }
    // si no, dejamos el punto como separador decimal
  } else if (s.indexOf(",") > -1) {
    // coma como separador decimal
    s = s.replace(/\./g, "").replace(",", ".");
  }

  // Eliminar cualquier carácter no numérico salvo punto y signo negativo
  s = s.replace(/[^0-9.-]+/g, "");

  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};

// Función para eliminar producto del carrito
const eliminarDelCarrito = (id) => {
  carrito = carrito.filter((item) => item.id !== id);
  guardarCarrito();
  actualizarCarrito();
};

// Función para cambiar cantidad
const cambiarCantidad = (id, nuevaCantidad) => {
  if (nuevaCantidad <= 0) {
    eliminarDelCarrito(id);
    return;
  }

  const producto = carrito.find((item) => item.id === id);
  if (producto) {
    producto.cantidad = nuevaCantidad;
    guardarCarrito();
    actualizarCarrito();
  }
};

// Función para actualizar la visualización del carrito
const actualizarCarrito = () => {
  // Limpiar tabla
  tabla.innerHTML = "";

  // Actualizar contador
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
  cartCount.textContent = totalItems;
  cartCount.classList.toggle("hidden", totalItems === 0);

  // Calcular total
  const total = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  totalElement.textContent = total.toLocaleString();

  // Agregar productos a la tabla (usando data-id en la fila y botones con clases)
  carrito.forEach((producto) => {
    const fila = document.createElement("tr");
    // Añadimos el id al dataset de la fila para que los listeners lo encuentren
    fila.dataset.id = producto.id;
    fila.innerHTML = `
            <td><img src="${producto.imagen}" alt="${producto.nombre}"/></td>
            <td>${producto.nombre}</td>
            <td>$${producto.precio.toLocaleString()}</td>
            <td>
                <div class="quantity-controls">
                    <button class="quantity-btn quantity-decrease" data-id="${producto.id}">-</button>
                    <span class="quantity-value">${producto.cantidad}</span>
                    <button class="quantity-btn quantity-increase" data-id="${producto.id}">+</button>
                </div>
            </td>
            <td>
                <button class="remove-item" data-id="${producto.id}">×</button>
            </td>
        `;
    tabla.appendChild(fila);
  });

  if (!tabla._hasCartListener) {
    tabla.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.dataset.id || btn.closest('tr')?.dataset.id;
      if (!id) return;

      if (btn.classList.contains('quantity-decrease')) {
        const prod = carrito.find((p) => p.id === id);
        cambiarCantidad(id, prod ? prod.cantidad - 1 : 0);
        return;
      }

      if (btn.classList.contains('quantity-increase')) {
        const prod = carrito.find((p) => p.id === id);
        cambiarCantidad(id, prod ? prod.cantidad + 1 : 1);
        return;
      }

      if (btn.classList.contains('remove-item')) {
        eliminarDelCarrito(id);
        return;
      }
    });
    tabla._hasCartListener = true;
  }
};

// Función para guardar carrito en localStorage
const guardarCarrito = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

// Event listener para vaciar carrito
vaciar.addEventListener("click", () => {
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
});
