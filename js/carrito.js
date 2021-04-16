const tabla = document.querySelector("#productos");
const rmt = document.querySelector("#producto tr")
const vaciar = document.querySelector("#limpiar")
const botones = document.querySelectorAll(".tarjeta > button");

botones.forEach((boton) => {
    boton.addEventListener("click", (evento) => {
        evento.preventDefault();

        const tarjeta = boton.parentElement;

        const producto = {
            imagen: tarjeta.querySelector("img").getAttribute("src"),
            nombre: tarjeta.querySelector("h3").textContent,
            precio: tarjeta.querySelector("div span").textContent,
            cantidad: 1
        }
        agregar(producto);
    })
})
const agregar = (producto) => {
    let cuerpo = "<tr>";
    cuerpo += "<td><img src=\"" + producto.imagen + "\"/></td>";
    cuerpo += "<td>" + producto.nombre + "</td>";
    cuerpo += "<td>" + producto.precio + "</td>";
    cuerpo += "<td>" + producto.cantidad + "</td>";
    cuerpo += "<td></td></tr>";
    console.log(cuerpo);
    tabla.insertAdjacentHTML("beforeend", cuerpo);
}
vaciar.addEventListener("click", () => {
    tabla.innerHTML="";
})