import {
    API_GENRE_MOVIE, API_GENRE_TV,
    API_KEY, API_URL_CATEGORIA, API_URL_INPUT
} from "./config";

const transformarListaAObjeto = (lista = []) => {
    return lista.reduce((acc, gen) => {
        acc[gen.id] = gen.name;
        return acc;
    }, {});
}

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
