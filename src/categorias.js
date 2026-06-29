import { genresMovie, genresTV } from "./genres.js";

export const categorias = new Map([
    ["movie", "Película"],
    ["tv", "Serie"]
]);

const crearCategoriasEntradas = (genres, tipo) =>
    Object.fromEntries(
        Object.entries(genres).map(([id, genero]) => [
            `${tipo}-${id}`,
            { id, genero, tipo }
        ])
    );

export const todasCategorias = {
    ...crearCategoriasEntradas(genresMovie, "movie"),
    ...crearCategoriasEntradas(genresTV, "tv")
};