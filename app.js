const inputBusqueda = document.getElementById("busqueda");
const botonBuscar = document.getElementById("btnBuscar");
const divResultados = document.getElementById("resultados");

console.log("Elementos conectados");
console.log("Input", inputBusqueda);
console.log("Botón", btnBuscar);
console.log("Div:", divResultados);

// Event listener para el botón
botonBuscar.addEventListener("click", function () {
    console.log("¡Hiciste click!");
    console.log("Texto escrito:", inputBusqueda.value);
});

