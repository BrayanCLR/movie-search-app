# 🎬 Buscador de Películas y Series

Aplicación web desarrollada con **JavaScript Vanilla** que permite buscar películas y series utilizando la API de TMDB (The Movie Database), mostrando información detallada de manera dinámica y organizada.

## ✨ Características

* 🔎 Búsqueda de películas y series por nombre.
* 🎭 Exploración por categorías y géneros.
* ⭐ Visualización de rating, popularidad y fecha de estreno.
* 🖼️ Carga de pósteres con imágenes optimizadas.
* 📱 Interfaz responsive.
* ⚡ Renderizado dinámico del DOM sin frameworks.
* 🧩 Código modular siguiendo el principio de separación de responsabilidades.

## 🛠️ Tecnologías Utilizadas

* HTML5
* CSS3
* JavaScript (ES Modules)
* Vite
* TMDB API

## 📂 Estructura del Proyecto

```text
src/
├── api.js       # Comunicación con la API de TMDB
├── config.js    # Configuración y constantes
├── main.js      # Punto de entrada y coordinación de la aplicación
├── ui.js        # Manipulación y renderizado del DOM
└── style.css    # Estilos de la aplicación
```

## 🚀 Instalación y Ejecución

1. Clona el repositorio:

```bash
git clone https://github.com/BrayanCLR/buscador-peliculas.git
```

2. Ingresa al directorio del proyecto:

```bash
cd buscador-peliculas
```

3. Instala las dependencias:

```bash
npm install
```

4. Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_TMDB_API_KEY=tu_api_key
```

5. Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

## 🔑 API Utilizada

Este proyecto utiliza la API de The Movie Database (TMDB):

* https://www.themoviedb.org/
* https://developer.themoviedb.org/

## 🎯 Objetivos de Aprendizaje

Este proyecto fue desarrollado con el propósito de practicar:

* Consumo de APIs REST.
* Programación asíncrona con `fetch`, `async` y `await`.
* Manipulación del DOM.
* Modularización con ES Modules.
* Manejo de estados y errores.
* Organización y mantenimiento de código JavaScript.

## 📸 Vista Previa

<img width="1920" height="1020" alt="buscadorShows" src="https://github.com/user-attachments/assets/09dfcc91-0e13-4e26-92ab-cf2e330fd184" />

## 👨‍💻 Autor

Desarrollado por **Brayan López** como parte de su proceso de aprendizaje en Desarrollo Fullstack.