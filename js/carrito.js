// Carrito de compras mejorado
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const tabla = document.querySelector("#productos");
const vaciar = document.querySelector("#limpiar");
const botones = document.querySelectorAll(".tarjeta > button");
const cartCount = document.querySelector("#cart-count");
const totalElement = document.querySelector("#total");

// Inicializar carrito al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  actualizarCarrito();
});

// Event listeners para botones de agregar
botones.forEach((boton) => {
  boton.addEventListener("click", (evento) => {
    evento.preventDefault();

    const tarjeta = boton.parentElement;
    const id = boton.getAttribute("data-id");

    const producto = {
      id: id,
      imagen: tarjeta.querySelector("img").getAttribute("src"),
      nombre: tarjeta.querySelector("h3").textContent,
      precio: parsePrice(tarjeta.querySelector("div span").textContent),
      cantidad: 1,
    };

    agregarAlCarrito(producto);
  });
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

  // Añadir listeners por delegación en el tbody `tabla` (maneja + / - / eliminar)
  // (evita exponer funciones globales y mantiene el DOM limpio)
  // Nota: removemos listeners previos para evitar duplicados si fuese necesario.
  // No usamos querySelectorAll para onclick aquí porque los botones ya no lo usan.
  // El listener se asegura de leer el `data-id` del botón clicado.
  // (Si ya existiera un listener, no se añade otro porque este bloque sólo configura
  // uno por render: usamos captura única mediante un flag simple.)
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
