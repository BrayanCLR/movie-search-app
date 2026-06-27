//ui.js
import { API_IMAGE_URL } from "./config.js";
import { categorias, todasCategorias } from "./categorias.js";

// Referencias al DOM exportadas para que main.js pueda ponerles Event Listeners
export const formBusqueda = document.getElementById("formBusqueda");
export const inputBusqueda = document.getElementById("busqueda");
export const divResultados = document.getElementById("resultados");
export const mensajeEstado = document.getElementById("mensajeEstado");
export const contenedorCategorias = document.querySelector(".categorias-lista");

export const obtenerBusqueda = () => inputBusqueda.value.trim();

export const mostrarMensaje = (mensaje) => {
    mensajeEstado.textContent = mensaje || "";
    mensajeEstado.className = "mensajeEstado";
};

export const mostrarLoading = (activo) => {
    mostrarMensaje(activo ? "Cargando..." : "");
};

export const renderShows = (shows) => {
    limpiarResultados();
    limpiarMensaje();

    const listaShows = crearFragmento(shows);
    divResultados.appendChild(listaShows);
    limpiarInput();
};

const limpiarMensaje = () => {
    mensajeEstado.textContent = "";
    mensajeEstado.removeAttribute("class");
}

const limpiarInput = () => {
    inputBusqueda.value = "";
}

const crearFragmento = (shows) => {
    const fragment = document.createDocumentFragment();
    shows.forEach(show => {
        fragment.append(construirShow(show));
    });
    return fragment;
}

const formatearNumero = (valor) => {
    if (valor === null || valor === undefined || valor === 0) return "Sin puntuación";
    return Number.isInteger(valor) ? valor : valor.toFixed(2);
};

const crearItemDL = (titulo, valor) => {
    const dt = document.createElement("dt");
    dt.textContent = titulo;

    const dd = document.createElement("dd");
    dd.classList.add("dd");
    dd.textContent = valor || "Desconocido";

    return [dt, dd];
}

export const limpiarResultados = () => {
    divResultados.replaceChildren(); // Método nativo moderno mucho más rápido que el bucle while
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
    dl.className = "dlListas";

    // Traducimos la categoría antes de pasarla a la lista de detalles
    const categoriaTraducida = categorias.get(show.categoria) || show.categoria;
    const generosTexto = show.generos.length > 0 ? show.generos.join(", ") : "Sin género";

    const [dt1, dd1] = crearItemDL("⭐️ Rating", formatearNumero(show.rating));
    const [dt2, dd2] = crearItemDL("🔥 Popularidad", formatearNumero(show.popularidad));
    const [dt3, dd3] = crearItemDL("📅 Estreno", show.estreno);
    const [dt4, dd4] = crearItemDL("📺 Categoría", categoriaTraducida);
    const [dt5, dd5] = crearItemDL("🎭 Géneros", generosTexto);

    const img = document.createElement("img");
    img.src = show.poster ? `${API_IMAGE_URL}${show.poster}` : "https://placehold.co/500x750?text=Sin+Poster";
    img.alt = `Poster de ${show.titulo}`;
    img.className = "poster";
    img.loading = "lazy"

    dl.append(dt1, dd1, dt2, dd2, dt3, dd3, dt4, dd4, dt5, dd5);
    articulo.append(h2, p, dl);
    liShow.append(img, articulo);

    return liShow;
}

const construirBotonesCategorias = () => {
    const fragmentoBotones = document.createDocumentFragment();

    Object.values(todasCategorias).forEach(genero => {
        const botonCategoria = document.createElement("button");

        botonCategoria.className = "btn-categoria";
        botonCategoria.dataset.id = genero.id; 
        botonCategoria.dataset.tipo = genero.tipo;
        botonCategoria.textContent = genero.genero;
        console.log(botonCategoria)
        fragmentoBotones.append(botonCategoria);
    });
    return fragmentoBotones;
}

contenedorCategorias.append(construirBotonesCategorias());