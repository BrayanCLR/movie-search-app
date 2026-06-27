export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const API_GENRE_TV = `https://api.themoviedb.org/3/genre/tv/list?language=es-MX&api_key=${API_KEY}`;
export const API_GENRE_MOVIE = `https://api.themoviedb.org/3/genre/movie/list?language=es-MX&api_key=${API_KEY}`;
export const API_URL_INPUT = `https://api.themoviedb.org/3/search/multi?language=es-MX&api_key=${API_KEY}&query=`;
export const API_URL_CATEGORIA = `https://api.themoviedb.org/3/discover/`;
export const API_IMAGE_URL = `https://image.tmdb.org/t/p/w500`;