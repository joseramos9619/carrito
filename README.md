# 🛒 Carrito de Compras Web

## 📋 Descripción
**Práctica de desarrollo web** - Simulación de carrito de compras, proyecto práctico de uso de **JavaScript**, **HTML5** y **CSS**

## ✨ Funcionalidades

### 🛍️ Características Principales
- **Catálogo de Productos**: Visualización de 6 productos con imágenes, nombres, precios y calificaciones
- **Carrito Inteligente**: Agregar productos al carrito con contador visual en tiempo real
- **Gestión de Cantidades**: Control de cantidades individuales (+/- por producto)
- **Cálculo Automático**: Total del carrito calculado automáticamente
- **Persistencia**: Los productos se mantienen en el carrito al recargar la página (localStorage)
- **Eliminación Selectiva**: Remover productos individuales o vaciar todo el carrito
- **Interfaz Responsiva**: Diseño adaptable a diferentes tamaños de pantalla

## 🚀 Cómo Usar
1. Abrir `index.html` en un navegador web
2. Explorar los productos disponibles
3. Hacer clic en "Agregar" para añadir productos al carrito
4. Pasar el mouse sobre el ícono de tienda para ver el carrito
5. Usar los controles +/- para ajustar cantidades
6. El carrito se guarda automáticamente

## 🛠️ Tecnologías
- **HTML5**: Estructura semántica
- **CSS3**: Estilos y diseño responsivo
- **JavaScript ES6**: Lógica de la aplicación y manipulación del DOM
- **localStorage**: Persistencia de datos local

## 🧪 Pruebas manuales y pasos de verificación (recomendado para reviewers)
Antes de aprobar un PR que afecte la lógica del carrito, sigue estos pasos de verificación locales:

1. Limpiar el almacenamiento local del sitio (DevTools > Application > Local Storage > eliminar `carrito`) o ejecutar en consola:

```javascript
localStorage.removeItem('carrito')
```

2. Abrir `index.html` en el navegador o lanzar Live Server en VS Code.
3. Agregar uno o más productos al carrito usando los botones "Agregar".
4. Probar controles de cantidad: aumentar (+) y disminuir (−) por producto.
5. Probar eliminar un producto individual del carrito.
6. Probar vaciar el carrito (si hay un botón "limpiar").
7. Recargar la página y verificar que los productos y cantidades se mantengan (persistencia).
8. Verificar que el contador en el header (`.cart-count`) refleje el número correcto de artículos.
9. Revisar la UI en tamaños móviles (responsive) y comprobar que no haya elementos cortados.
10. Si el repositorio incluye tests, ejecutar `npm test` y revisar que pasen.

Si algo falla, documenta en el PR:
- Pasos exactos para reproducir
- Capturas de pantalla (si aplica)
- Mensajes de error de la consola

## ✅ Checklist de revisión de PR
- [ ] Limpiar `localStorage.carrito`
- [ ] Abrir `index.html` o usar Live Server
- [ ] Agregar producto y comprobar funcionamiento de `Agregar`
- [ ] Aumentar y disminuir cantidades (controles +/-)
- [ ] Eliminar producto individual
- [ ] Vaciar carrito (si aplica)
- [ ] Recargar y confirmar persistencia
- [ ] Revisar contador en header y UI responsive
- [ ] Incluir pasos reproducibles en el PR si hay fallos

---

Si quieres que añada instrucciones de ejecución más detalladas (por ejemplo, configurar `npm` + `jest` para tests), puedo crear un PR separado que agregue `package.json` y una suite de pruebas mínima.
