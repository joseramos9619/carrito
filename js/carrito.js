// Carrito de compras mejorado
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const tabla = document.querySelector("#productos");
const vaciar = document.querySelector("#limpiar");
const botones = document.querySelectorAll(".tarjeta > button");
const cartCount = document.querySelector("#cart-count");
const totalElement = document.querySelector("#total");

// Inicializar carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
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
            precio: parseFloat(tarjeta.querySelector("div span").textContent.replace('$', '').replace('.', '')),
            cantidad: 1
        };

        agregarAlCarrito(producto);
    });
});

// Función para agregar producto al carrito
const agregarAlCarrito = (producto) => {
    const productoExistente = carrito.find(item => item.id === producto.id);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push(producto);
    }
    
    guardarCarrito();
    actualizarCarrito();
};

// Función para eliminar producto del carrito
const eliminarDelCarrito = (id) => {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    actualizarCarrito();
};

// Función para cambiar cantidad
const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }
    
    const producto = carrito.find(item => item.id === id);
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
    cartCount.classList.toggle('hidden', totalItems === 0);
    
    // Calcular total
    const total = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    totalElement.textContent = total.toLocaleString();
    
    // Agregar productos a la tabla
    carrito.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><img src="${producto.imagen}" alt="${producto.nombre}"/></td>
            <td>${producto.nombre}</td>
            <td>$${producto.precio.toLocaleString()}</td>
            <td>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="cambiarCantidad('${producto.id}', ${producto.cantidad - 1})">-</button>
                    <span>${producto.cantidad}</span>
                    <button class="quantity-btn" onclick="cambiarCantidad('${producto.id}', ${producto.cantidad + 1})">+</button>
                </div>
            </td>
            <td>
                <button class="remove-item" onclick="eliminarDelCarrito('${producto.id}')">×</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
};

// Función para guardar carrito en localStorage
const guardarCarrito = () => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
};

// Event listener para vaciar carrito
vaciar.addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
});