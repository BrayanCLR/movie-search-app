import "./style.css"
import { buscarShowsEnAPI, buscarShowPorCategoriaEnAPI } from "./api";
import {
    obtenerBusqueda, renderShows, contenedorCategorias,
    mostrarLoading, limpiarResultados, mostrarMensaje, formBusqueda
} from "./ui";

let isLoadingCategory = false;

contenedorCategorias.addEventListener("click", async (e) => {
    const boton = e.target.closest(".btn-categoria");

    if (!boton || isLoadingCategory) return;

    isLoadingCategory = true;

    try {
        mostrarLoading(true)

        const id = boton.dataset.id;
        const tipo = boton.dataset.tipo;

        const { error, shows } = await buscarShowPorCategoriaEnAPI(id, tipo);

        
        if (error) {
            mostrarMensaje(error);
            return;
        }
        
        renderShows(shows)
        
    } finally{
        isLoadingCategory = false;
        mostrarLoading(false);
    }
});

const realizarBusqueda = async (query) => {
    const { error, shows } = await buscarShowsEnAPI(query);
    mostrarLoading(false);

    if (error) {
        limpiarResultados();
        mostrarMensaje(error);
        return;
    }
    renderShows(shows);
}

let isSearching = false;

formBusqueda.addEventListener("submit", (e) => {
    e.preventDefault();
    if (isSearching) return;

    isSearching = true;
    mostrarLoading(true);

    const query = obtenerBusqueda();

    realizarBusqueda(query).finally(() => {
        isSearching = false;
    });
});