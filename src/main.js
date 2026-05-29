import "./style.css"

const formBusqueda = document.getElementById("formBusqueda");
const inputBusqueda = document.getElementById("busqueda");
const botonBuscar = document.getElementById("btnBuscar");
const divResultados = document.getElementById("resultados");

let shows = [];

const API_KEY = 'e1ecc8e2bd5ae8552c91d9d04fe6bee8';
const API_URL = `https://api.themoviedb.org/3/search/movie?language=es-MX&api_key=${API_KEY}&query=`;
const API_IMAGE_URL = `https://image.tmdb.org/t/p/w500`;

const obtenerBusqueda = () => inputBusqueda.value.trim();

const buscarShows = async () => {
    const query = obtenerBusqueda();
    if (!query) return;

    try {
        const request = await fetch(`${API_URL}${query}`);

        if (!request.ok) {
            throw new Error(`Error HTTP de Servidor: ${request.status}`);
        }

        const data = await request.json();

        shows = (data.results || []).map(show => ({
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

const formatearNumero = (valor) => (
    Number.isInteger(valor) ? valor : valor.toFixed(2)
);

const crearItemDL = (titulo, valor) => {
    const dt = document.createElement("dt");
    dt.textContent = titulo;

    const dd = document.createElement("dd");
    dd.classList.add("dd");
    dd.textContent = valor;

    return [dt, dd];
}

const construirShow = (show) => {
    const liShow = document.createElement("li");
    liShow.classList.add("show");
    const articulo = document.createElement("article");

    const h2 = document.createElement("h2");
    h2.textContent = show.titulo;

    const p = document.createElement("p");
    p.textContent = show.descripcion;

    const dl = document.createElement("dl");
    dl.classList.add("dlistas");

    const [dt1, dd1] = crearItemDL("⭐️ Rating", formatearNumero(show.rating));
    const [dt2, dd2] = crearItemDL("🔥 Popularidad", formatearNumero(show.popularidad));
    const [dt3, dd3] = crearItemDL("📅 Estreno", show.estreno);

    const img = document.createElement("img");
    img.src = `${API_IMAGE_URL}${show.poster}`;
    img.alt = "Poster del Show";
    img.classList.add("poster");

    dl.append(dt1, dd1, dt2, dd2, dt3, dd3);
    articulo.append(h2, p, dl);
    liShow.append(img, articulo);

    return liShow;
}

const crearDivShow = () => {
    const fragment = document.createDocumentFragment();

    shows.forEach(show => {
        const showListo = construirShow(show);
        fragment.appendChild(showListo);
    })

    return fragment;
}

const limpiarDivShows = () => {
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