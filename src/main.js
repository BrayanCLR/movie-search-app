import "./style.css"

const formBusqueda = document.getElementById("formBusqueda");
const inputBusqueda = document.getElementById("busqueda");
const divResultados = document.getElementById("resultados");
const mensajeEstado = document.getElementById("mensajeEstado");
const contenedorCategorias = document.querySelector(".categorias-lista");

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL_INPUT = `https://api.themoviedb.org/3/search/multi?language=es-MX&api_key=${API_KEY}&query=`;
const API_URL_CATEGORIA = `https://api.themoviedb.org/3/discover/`;
const API_IMAGE_URL = `https://image.tmdb.org/t/p/w500`;
const API_GENRE_MOVIE = `https://api.themoviedb.org/3/genre/movie/list?language=es-MX&api_key=${API_KEY}`;
const API_GENRE_TV = `https://api.themoviedb.org/3/genre/tv/list?language=es-MX&api_key=${API_KEY}`;

/**
 * @typedef {Object} Genero
 * @property {number} id Identificador único del género.
 * @property {string} name Nombre del género.
 */

/**
 * @typedef {Object} Show
 * @property {string} titulo Título del show.
 * @property {string} descripcion Descripción breve del show.
 * @property {number} rating Puntuación promedio.
 * @property {number} popularidad Valor de popularidad.
 * @property {string} estreno Fecha de estreno o texto alternativo.
 * @property {string} poster Ruta del póster.
 * @property {string} categoria Tipo del contenido: movie o tv.
 * @property {string[]} generos Lista de nombres de géneros.
 */

/**
 * @typedef {Object} ResultadoBusqueda
 * @property {string|null} error Mensaje de error si la búsqueda falla, o null si fue exitosa.
 * @property {Show[]} shows Lista de resultados obtenidos.
 */

/**
 * Obtiene el texto ingresado en el campo de búsqueda, eliminando espacios al inicio y al final.
 *
 * @returns {string} Término de búsqueda sin espacios extra.
 */
const obtenerBusqueda = () => inputBusqueda.value.trim();

const categorias = new Map([
    ["movie", "Película"],
    ["tv", "Serie"]
]);

/**
 * Convierte una lista de géneros en un objeto indexado por su identificador.
 *
 * @param {Genero[]} [lista=[]] Lista de objetos con identificador y nombre.
 * @returns {Record<number, string>} Objeto donde cada clave es el ID del género y cada valor es su nombre.
 */
const transformarListaAObjeto = (lista = []) => {
    return lista.reduce((acc, gen) => {
        acc[gen.id] = gen.name;
        return acc;
    }, {});
};

// 1. Trae los catálogos de la API externa
/**
 * Consulta los catálogos de géneros de películas y series desde la API de TMDB.
 *
 * @returns {Promise<{ genresMovie: Record<number, string>, genresTV: Record<number, string> }>} Promesa con los catálogos ya transformados.
 */
const consultarCatalogosDeGeneros = async () => {
    try {
        const [movieResponse, tvResponse] = await Promise.all([
            fetch(API_GENRE_MOVIE),
            fetch(API_GENRE_TV)
        ]);

        if (!movieResponse.ok || !tvResponse.ok) {
            throw new Error(`Error HTTP: ${!movieResponse.ok ? movieResponse.status : tvResponse.status}`);
        }

        const [movieData, tvData] = await Promise.all([
            movieResponse.json(),
            tvResponse.json()
        ]);

        return {
            genresMovie: transformarListaAObjeto(movieData.genres),
            genresTV: transformarListaAObjeto(tvData.genres)
        };

    } catch (error) {
        console.error("Error al cargar géneros:", error);
        return { genresMovie: {}, genresTV: {} };
    }
};

/**
 * Carga los catálogos de géneros en variables globales para usarlos durante la búsqueda.
 *
 * @returns {Promise<void>} Promesa que finaliza cuando los catálogos quedaron inicializados.
 */
const { genresMovie, genresTV } = await consultarCatalogosDeGeneros();

const crearCategoriasEntradas = (genres, tipo) => {
    return Object.fromEntries(
            Object.entries(genres).map(([id, genero]) => [
                `${tipo}-${id}`,
                {
                    id,
                    genero,
                    tipo
                }
            ])
        );
}

const todasCategorias = {
    ...crearCategoriasEntradas(genresMovie, "movie"),
    ...crearCategoriasEntradas(genresTV, "tv")
}

const construirBotonesCategorias = () => {

    return Object.entries(todasCategorias).map(([key, genero]) => {

        const botonCategoria = document.createElement("button");

        botonCategoria.className = "btn-categoria";
        botonCategoria.dataset.id = genero.id;
        botonCategoria.dataset.tipo = genero.tipo;

        botonCategoria.textContent = genero.genero;

        return botonCategoria;
    })
}

const buscarShowPorCategoria = async (id, tipo) => {
    try {
        const response = await fetch(`${API_URL_CATEGORIA}${tipo}?api_key=${API_KEY}&with_genres=${id}&language=es-MX`);

        if (!response.ok) {
            mostrarMensaje(`Error en servidor: ${response.status}`);
            throw new Error(`Error HTTP de Servidor: ${response.status}`);
        }

        const data = await response.json();

        const shows = data.results.map(show => ({
            titulo: show.title || show.name,
            descripcion: show.overview || "Sin Descripcion",
            rating: show.vote_average,
            popularidad: show.popularity,
            estreno: show.release_date || show.first_air_date,
            poster: show.poster_path,
            categoria: tipo,
            generos: show.genre_ids
        }));
        renderShows(mapearIdsANombresDeGeneros(shows));
    } catch (error) {
        mostrarMensaje(`Ocurrio un Error al Buscar la Categoria: ${error.message}`)
    }

}

const botones = construirBotonesCategorias()
const fragmentoBotones = document.createDocumentFragment()
botones.forEach(boton => fragmentoBotones.append(boton))
contenedorCategorias.append(fragmentoBotones)

contenedorCategorias.addEventListener("click", (e) => {

    if (e.target.classList.contains("btn-categoria")) {
        const id = e.target.dataset.id
        const tipo = e.target.dataset.tipo
        mostrarLoading(true)
        buscarShowPorCategoria(id, tipo)/*posible funcion general */
    }
});
/**
 * Reemplaza los identificadores de géneros por sus nombres legibles para cada show.
 *
 * @param {Array<{
 *   titulo: string,
 *   descripcion: string,
 *   rating: number,
 *   popularidad: number,
 *   estreno: string,
 *   poster: string,
 *   categoria: string,
 *   generos: number[]
 * }>} shows Lista de elementos a transformar.
 * @returns {Show[]} Nueva lista con los géneros ya convertidos a texto.
 */
const mapearIdsANombresDeGeneros = (shows) => {
    return shows.map(show => ({
        ...show,
        generos: show.generos.map(id =>
            show.categoria === "movie"
                ? genresMovie[id] || "Otros"
                : genresTV[id] || "Otros"
        )
    }));
};

/**
 * Busca películas y series en la API de TMDB usando el texto ingresado por el usuario.
 *
 * @returns {Promise<ResultadoBusqueda>} Objeto con el resultado de la búsqueda y un posible mensaje de error.
 */
const buscarShows = async () => {
    const query = obtenerBusqueda();
    if (!query) {
        return { error: "El término de búsqueda no puede estar vacío.", shows: [] };
    }

    try {
        const request = await fetch(`${API_URL_INPUT}${encodeURIComponent(query)}`); // encodeURIComponent previene errores con espacios/acentos

        if (!request.ok) {
            mostrarMensaje(`Error en servidor: ${request.status}`);
            throw new Error(`Error HTTP de Servidor: ${request.status}`);
        }

        const data = await request.json();

        const shows = (data.results || [])
            .filter(item => item.media_type === "movie" || item.media_type === "tv")
            .map(show => ({
                titulo: show.title || show.name,
                descripcion: show.overview || "Sin descripción disponible.",
                rating: show.vote_average,
                popularidad: show.popularity,
                estreno: show.release_date || show.first_air_date || "No disponible",
                poster: show.poster_path,
                categoria: show.media_type,
                generos: show.genre_ids || []
            }));

        if (shows.length === 0) {
            return { error: "No se encontraron resultados para tu búsqueda.", shows: [] };
        }

        // Aplicamos el mapeo de géneros antes de retornar
        const showsConGeneros = mapearIdsANombresDeGeneros(shows);

        return { error: null, shows: showsConGeneros };

    } catch (error) {
        return { error: `Ocurrió un error al buscar shows: ${error.message}`, shows: [] };
    }
}

/**
 * Formatea valores numéricos para mostrar en la interfaz.
 *
 * @param {number | null | undefined} valor Número a representar.
 * @returns {string | number} Texto formateado o el valor original cuando corresponde.
 */
const formatearNumero = (valor) => {
    if (valor === null || valor === undefined || valor === 0) return "Sin puntuación";
    return Number.isInteger(valor) ? valor : valor.toFixed(2);
};

// CORRECCIÓN: Función genérica para construir elementos de la lista de detalles
/**
 * Crea un par de elementos `<dt>` y `<dd>` para mostrar una etiqueta y su valor en un listado descriptivo.
 *
 * @param {string} titulo Texto de la etiqueta del detalle.
 * @param {string | number} valor Valor que se mostrará en el detalle.
 * @returns {Array<HTMLElement>} Arreglo con el elemento `<dt>` y el elemento `<dd>`.
 */
const crearItemDL = (titulo, valor) => {
    const dt = document.createElement("dt");
    dt.textContent = titulo;

    const dd = document.createElement("dd");
    dd.classList.add("dd");
    dd.textContent = valor || "Desconocido";

    return [dt, dd];
}

/**
 * Crea un elemento de lista con la información principal de un show.
 *
 * @param {Show} show Objeto con los datos del show a renderizar.
 * @returns {HTMLLIElement} Elemento `<li>` listo para insertarse en el DOM.
 */
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

/**
 * Crea un fragmento con todos los elementos visuales correspondientes a una lista de shows.
 *
 * @param {Show[]} shows Arreglo de shows a representar.
 * @returns {DocumentFragment} Fragmento del DOM con todos los elementos generados.
 */
const crearFragmento = (shows) => {
    const fragment = document.createDocumentFragment();
    shows.forEach(show => {
        fragment.append(construirShow(show));
    });
    return fragment;
}

/**
 * Elimina todos los resultados actuales mostrados en la interfaz.
 *
 * @returns {void}
 */
const limpiarResultados = () => {
    divResultados.replaceChildren(); // Método nativo moderno mucho más rápido que el bucle while
}

/**
 * Limpia el mensaje de estado que se muestra al usuario.
 *
 * @returns {void}
 */
const limpiarMensaje = () => {
    mensajeEstado.textContent = "";
    mensajeEstado.removeAttribute("class");
}

/**
 * Limpia el contenido del campo de búsqueda.
 *
 * @returns {void}
 */
const limpiarInput = () => {
    inputBusqueda.value = "";
}

/**
 * Ejecuta la búsqueda y actualiza la interfaz según el resultado obtenido.
 *
 * @returns {Promise<void>} Promesa que termina cuando se procesó la respuesta.
 */
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

/**
 * Muestra un mensaje en el área de estado de la aplicación.
 *
 * @param {string} mensaje Texto a mostrar al usuario.
 * @returns {void}
 */
const mostrarMensaje = (mensaje) => {
    mensajeEstado.textContent = mensaje || "";
    mensajeEstado.className = "mensajeEstado";
}

/**
 * Renderiza la lista de shows en el contenedor de resultados.
 *
 * @param {Show[]} shows Arreglo de shows a mostrar.
 * @returns {void}
 */
const renderShows = (shows) => {
    limpiarResultados();
    limpiarMensaje();

    const listaShows = crearFragmento(shows);
    divResultados.appendChild(listaShows);
    limpiarInput();
}

/**
 * Muestra u oculta el estado de carga en la interfaz.
 *
 * @param {boolean} activo Indica si el loading debe mostrarse.
 * @returns {void}
 */
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