import "./style.css"

const formBusqueda = document.getElementById("formBusqueda");
const inputBusqueda = document.getElementById("busqueda");
const botonBuscar = document.getElementById("btnBuscar");
const divResultados = document.getElementById("resultados");
const mensajeEstado = document.getElementById("mensajeEstado");

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = `https://api.themoviedb.org/3/search/multi?language=es-MX&api_key=${API_KEY}&query=`;
const API_IMAGE_URL = `https://image.tmdb.org/t/p/w500`;
const API_GENRE_MOVIE = `https://api.themoviedb.org/3/genre/movie/list?language=es-MX&api_key=${API_KEY}`;
const API_GENRE_TV = `https://api.themoviedb.org/3/genre/tv/list?language=es-MX&api_key=${API_KEY}`;

const obtenerBusqueda = () => inputBusqueda.value.trim();

const cargarGeneros = async () => {
    try {
        const { genresMovie, genresTV } = await Promise.all([
            fetch(API_GENRE_MOVIE).then(res => res.json()).then(data => data.genres || []),
            fetch(API_GENRE_TV).then(res => res.json()).then(data => data.genres || [])
        ]).then(([movieGenres, tvGenres]) => {

            const genresMovie = movieGenres.reduce((acc, genre) => {
                acc[genre.id] = genre.name;
                return acc;
            }, {});
            const genresTV = tvGenres.reduce((acc, genre) => {
                acc[genre.id] = genre.name;
                return acc;
            }, {});

            return { genresMovie, genresTV };
        });
        return { genresMovie, genresTV };
    } catch (error) {
        console.error("Error al cargar géneros:", error);
        return { genresMovie: {}, genresTV: {} };
    }
};

let genresMovie = {};
let genresTV = {};

const inicializar = async () => {
    const generos = await cargarGeneros();

    genresMovie = generos.genresMovie;
    genresTV = generos.genresTV;
};

inicializar();

const cargarYMapearGeneros = (shows) => {
    return shows.map(show => ({
        ...show,
        generos: show.generos.map(id =>
            show.categoria === "movie"
                ? genresMovie[id]
                : genresTV[id]
        )
    }));
};

const buscarShows = async () => {
    const query = obtenerBusqueda();
    if (!query) {
        return {
            error: "El término de búsqueda no puede estar vacío.",
            shows: []
        };
    }

    try {
        const request = await fetch(`${API_URL}${query}`);

        if (!request.ok) {
            throw new Error(`Error HTTP de Servidor: ${request.status}`);
        }

        const data = await request.json();
        console.log(data.results)

        const shows = (data.results || [])
            .filter(item => item.media_type === "movie" || item.media_type === "tv")
            .map(show => ({
                titulo: show.title || show.name,
                descripcion: show.overview,
                rating: show.vote_average,
                popularidad: show.popularity,
                estreno: show.release_date || show.first_air_date,
                poster: show.poster_path,
                categoria: show.media_type,
                generos: show.genre_ids || []
            }));

        if (shows.length === 0) {
            return {
                error: "No se encontraron resultados para tu búsqueda.",
                shows: []
            };
        }

        return {
            error: null,
            shows: await cargarYMapearGeneros(shows)
        };

    } catch (error) {
        return {
            error: `ocurrió un error al buscar shows: ${error.message}`,
            shows: []
        };
    }
}

const formatearNumero = (valor) => {
    if (valor === null || valor === undefined) {
        return "Sin puntuación";
    }

    return Number.isInteger(valor)
        ? valor
        : valor.toFixed(2);
};

const categorias = {
    tv: "Serie",
    movie: "Película"
}

const crearItemDL = (titulo, valor) => {
    const dt = document.createElement("dt");
    dt.textContent = titulo;

    const dd = document.createElement("dd");
    dd.classList.add("dd");

    dd.textContent = categorias[valor] || valor || "Desconocido";

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
    dl.className = "dlListas";

    const [dt1, dd1] = crearItemDL("⭐️ Rating", formatearNumero(show.rating));
    const [dt2, dd2] = crearItemDL("🔥 Popularidad", formatearNumero(show.popularidad));
    const [dt3, dd3] = crearItemDL("📅 Estreno", show.estreno);
    const [dt4, dd4] = crearItemDL("📺 Categoría", show.categoria);
    const [dt5, dd5] = crearItemDL("🎭 Géneros", show.generos.join(", "));

    const img = document.createElement("img");
    img.src = show.poster ? `${API_IMAGE_URL}${show.poster}` :
        "/placeholder.png";
    img.alt = "Poster del Show";
    img.className = "poster";

    dl.append(dt1, dd1, dt2, dd2, dt3, dd3, dt4, dd4, dt5, dd5);
    articulo.append(h2, p, dl);
    liShow.append(img, articulo);

    return liShow;
}

const crearFragmento = (shows) => {
    const fragment = document.createDocumentFragment();

    shows.forEach(show => {
        const showListo = construirShow(show);
        fragment.append(showListo);
    })

    return fragment;
}

const limpiarResultados = () => {
    while (divResultados.firstChild) {
        divResultados.removeChild(divResultados.firstChild);
    }
}

const limpiarMensaje = () => {
    mensajeEstado.textContent = "";
    mensajeEstado.removeAttribute("class");
}

const limpiarInput = () => {
    inputBusqueda.value = "";
}

const realizarBusqueda = async () => {
    const { error, shows } = await buscarShows();
    mostrarLoading(false);

    if (error) {
        limpiarResultados();
        mostrarMensaje(error);
        return;
    }
    renderShows(shows);
}

const mostrarMensaje = (mensaje) => {
    mensajeEstado.textContent = mensaje || "";
    mensajeEstado.className = "mensajeEstado";
}

const renderShows = (shows) => {
    limpiarResultados();
    limpiarMensaje();

    const listaShows = crearFragmento(shows);
    divResultados.appendChild(listaShows);

    limpiarInput();
}

const mostrarLoading = (activo) => {
    mostrarMensaje(activo ? "Cargando..." : "");
}

let isSearching = false;

formBusqueda.addEventListener("submit", (e) => {
    e.preventDefault();

    if (isSearching) return;

    isSearching = true;
    mostrarLoading(true);

    realizarBusqueda().finally(() => {
        isSearching = false;
    });
});