//api.js
import { API_KEY, API_URL_CATEGORIA, API_URL_INPUT } from "./config.js";

import { genresMovie, genresTV } from "./genres.js";

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

export const buscarShowsEnAPI = async (query) => {

    if (!query) {
        return { error: "El término de búsqueda no puede estar vacío.", shows: [] };
    }

    try {
        const request = await fetch(`${API_URL_INPUT}${encodeURIComponent(query)}`); // encodeURIComponent previene errores con espacios/acentos

        if (!request.ok) {
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
        console.error(error);
        return { error: `Ocurrió un error al buscar shows: ${error.message}`, shows: [] };
    }
}

export const buscarShowPorCategoriaEnAPI = async (id, tipo) => {
    try {
        const response = await fetch(`${API_URL_CATEGORIA}${tipo}?api_key=${API_KEY}&with_genres=${id}&language=es-MX`);

        if (!response.ok) {
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

        const showsConGeneros = mapearIdsANombresDeGeneros(shows);

        return { error: null, shows: showsConGeneros };
    } catch (error) {
        console.error(error);
        return { error: "Ocurrio un Error al Buscar la Categoria", shows: [] };
    }
}