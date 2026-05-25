import "./style.css"

const formBusqueda = document.getElementById("formBusqueda");
const inputBusqueda = document.getElementById("busqueda");
const botonBuscar = document.getElementById("btnBuscar");
const divResultados = document.getElementById("resultados");

let shows = [];

const API_KEY = 'e1ecc8e2bd5ae8552c91d9d04fe6bee8';
const API_URL = `https://api.themoviedb.org/3/search/movie?language=es-ES&api_key=${API_KEY}&query=`;
const API_IMAGE_URL = `https://image.tmdb.org/t/p/w500`;

const obtenerBusqueda = () => inputBusqueda.value.trim();

const buscarShows = async () => {
    const query = obtenerBusqueda();

    try {
        const request = await fetch(`${API_URL}${query}`);

        if (!request.ok) {
            throw new Error(`Error HTTP de Servidor: ${request.status}`);
        }

        const data = await request.json();
        console.log(data);
        shows = data.results.map(show => ({
            titulo: show.title,
            descripcion: show.overview,
            rating: show.vote_average,
            popularidad: show.popularity,
            estreno: show.release_date,
            poster: show.poster_path
        }));

    } catch (error) {
        console.error(`Error al Buscar un Show: ${error.message}`);
    }
}

const construirShow = (show) => {
    const divShow = document.createElement("div");
    divShow.classList.add("show");

    const h2 = document.createElement("h2");
    h2.textContent = show.titulo;

    const p1 = document.createElement("p");
    p1.textContent = show.descripcion;

    const p2 = document.createElement("p");
    p2.textContent = show.rating;

    const p3 = document.createElement("p");
    p3.textContent = show.popularidad;

    const p4 = document.createElement("p");
    p4.textContent = show.estreno;

    const img = document.createElement("img");
    img.src = `${API_IMAGE_URL}${show.poster}`;
    img.alt = "Poster del Show";
    img.classList.add("poster");

    divShow.appendChild(h2);
    divShow.appendChild(p1);
    divShow.appendChild(p2);
    divShow.appendChild(p3);
    divShow.appendChild(p4);
    divShow.appendChild(img);

    return divShow;
}

const crearDivShow = () => {
    const fragment = document.createDocumentFragment();

    shows.forEach(show => {
        const showListo = construirShow(show);
        fragment.appendChild(showListo);
    })

    return fragment;
}

const limpiarDivShows = ()=>{
    while (divResultados.firstChild) {
        divResultados.removeChild(divResultados.firstChild);
    }
}

const renderShows = () => {
    limpiarDivShows();
    const listaShows = crearDivShow();
    divResultados.appendChild(listaShows);
}

formBusqueda.addEventListener("submit", async (e) => {
    e.preventDefault();
    await buscarShows();
    renderShows();
});