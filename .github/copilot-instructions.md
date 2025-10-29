## Instrucciones rápidas para agentes AI (proyecto `carrito`)

Breve: esto es una app web estática cliente (HTML/CSS/JS) que implementa un carrito de compras puro en el navegador. No hay backend, no hay build ni dependencias externas.

- Punto de entrada: `index.html` — carga `css/estilo.css` y `js/carrito.js`.
- Lógica principal: `js/carrito.js` — manejo del DOM, persistencia en `localStorage` (clave: `carrito`) y render del carrito.

Qué debes saber antes de cambiar código

- Persistencia: el arreglo `carrito` se lee/escribe desde `localStorage` (clave `'carrito'`). Para probar cambios en estado, limpia esa clave o usa herramientas de DevTools (Application > Local Storage).
- Selección y estructura de productos: cada tarjeta de producto en `index.html` tiene la estructura `.tarjeta` con un `button[data-id]`. El script selecciona botones con `document.querySelectorAll('.tarjeta > button')` al cargar. Si generas dinámicamente tarjetas, re-evalúa/reasigna listeners.
- Formato de precios: en `js/carrito.js` se hace
  - lectura: extrae `span` dentro de la tarjeta y aplica `.replace('$','').replace('.', '')` antes de `parseFloat` — esto asume un punto como separador de miles y no soporta valores con más de un punto. Ten cuidado al cambiar el formato o internacionalización.
  - visualización: usa `toLocaleString()` para mostrar el total.
- Inline handlers: las filas del carrito usan `onclick="cambiarCantidad(...)"` y `onclick="eliminarDelCarrito(...)"`. Si refactorizas a módulos o bundlers, expón esas funciones en `window` o refactoriza el render para añadir listeners desde el scope del módulo.

Patrones y convenciones del repositorio

- UI / DOM: Se prefiere manipular el DOM directamente (createElement, innerHTML, appendChild). No hay frameworks ni convenciones de templating.
- Estado: El único estado persistente es `carrito` en `localStorage`. Evita duplicar fuentes de verdad.
- Clases CSS: `cart-count` controla el contador en `header`; la clase `hidden` la oculta. La visibilidad del panel `.carrito` se controla por `:hover` en `.menu` en CSS (no por JavaScript), tenlo en cuenta si agregas animaciones JS.

Pruebas y flujo de desarrollo

- No hay pruebas automatizadas ni build scripts. Para ejecutar manualmente: abrir `index.html` en el navegador. Recomendado: usar la extensión Live Server de VS Code para evitar problemas de rutas/recarga.
- Depuración: usar DevTools — puntos clave:
  - Consola para errores JS
  - Application > Local Storage (clave `carrito`)
  - Element inspector para verificar estructura `.tarjeta` y botones con `data-id`.

Ejemplos prácticos (referencias de código)

- Añadir un nuevo producto: duplicar una `.tarjeta` en `index.html`, asegurar `button[data-id="N"]`, imagen en `img/` y precio en el `span`.
- Modificar cálculo del total: ver `actualizarCarrito()` en `js/carrito.js` — la suma se hace con reduce y luego `totalElement.textContent = total.toLocaleString()`.
- Vaciar carrito: el botón con id `limpiar` limpia `carrito` y llama a `guardarCarrito()` + `actualizarCarrito()`.

Precauciones al refactorizar

- Si separas `js/carrito.js` en módulos, busca todas las referencias globales/inline (onclick) y reemplázalas por listeners.
- Cambios en el formato de precios deben actualizar tanto la extracción (parse) como la presentación (toLocaleString).
- No asumas un servidor: rutas de recursos son relativas (p. ej. `img/1.webp`) y funcionan sin Node.

Pistas de tareas comunes para agentes

- Añadir producto programáticamente: agrega objeto con {id, imagen, nombre, precio, cantidad} y usa `agregarAlCarrito(producto)` para mantener la lógica de guardado y render.
- Soporte multi-formato numérico: centraliza la normalización de precios (ej. una función `parsePrice(str)`) y úsala donde se lee el precio.

Dónde mirar primero

- `index.html` — estructura de las tarjetas y botones
- `js/carrito.js` — flujo completo: carga, agregar, eliminar, cambiar cantidad, persistencia
- `css/estilo.css` — clases visuales y comportamiento por `:hover`
- `README.md` — descripción y guía de uso (abrir `index.html`)

Si algo no está claro o quieres que amplíe ejemplos (p. ej. cómo exponer funciones al scope global o proponer una refactorización modular), dime cuál parte quieres que detalle y lo actualizo.
