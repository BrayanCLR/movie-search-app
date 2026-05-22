const inputBusqueda = document.getElementById("busqueda");
const botonBuscar = document.getElementById("btnBuscar");
const divResultados = document.getElementById("resultados");

console.log("Elementos conectados");
console.log("Input", inputBusqueda);
console.log("Botón", btnBuscar);
console.log("Div:", divResultados);

const shows = [];

const query = inputBusqueda.value.trim()
const API_KEY = 'e1ecc8e2bd5ae8552c91d9d04fe6bee8';
const API_URL = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${e1ecc8e2bd5ae8552c91d9d04fe6bee8}`;


