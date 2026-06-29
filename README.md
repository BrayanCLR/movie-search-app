# 🎬 Buscador de Películas y Series

![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?logo=javascript\&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite\&logoColor=white)
![TMDB](https://img.shields.io/badge/API-TMDB-01D277)
![Learning](https://img.shields.io/badge/Learning-Frontend-blue)
![Status](https://img.shields.io/badge/Status-Finalizado-success)

Aplicación web desarrollada con **JavaScript Vanilla** que permite buscar películas y series utilizando la API de **The Movie Database (TMDB)**. La aplicación ofrece búsquedas por nombre y exploración por géneros, mostrando información detallada de manera dinámica y organizada.

---

## ✨ Características

* 🔎 Búsqueda de películas y series por nombre.
* 🎭 Exploración por géneros y categorías.
* ⭐ Visualización de rating, popularidad y fecha de estreno.
* 🖼️ Carga dinámica de pósteres desde TMDB.
* 📱 Diseño responsive.
* ⚡ Manipulación dinámica del DOM sin frameworks.
* 🧩 Arquitectura modular utilizando ES Modules.
* 🚦 Manejo de errores y estados de carga.

---

## 🛠️ Tecnologías Utilizadas

* HTML5
* CSS3
* JavaScript (ES2023)
* Vite
* TMDB API

---

## 📂 Estructura del Proyecto

```text
.
├── public
│   └── favicon.png
├── src
│   ├── api.js
│   ├── categorias.js
│   ├── config.js
│   ├── genres.js
│   ├── main.js
│   ├── style.css
│   └── ui.js
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

### Descripción de los módulos

| Archivo         | Responsabilidad                                             |
| --------------- | ----------------------------------------------------------- |
| `main.js`       | Punto de entrada y coordinación de la aplicación.           |
| `api.js`        | Comunicación con la API de TMDB y obtención de datos.       |
| `ui.js`         | Manipulación y renderizado del DOM.                         |
| `config.js`     | Configuración y constantes globales.                        |
| `genres.js`     | Gestión y transformación de géneros obtenidos desde la API. |
| `categorias.js` | Traducción y manejo de categorías de contenido.             |
| `style.css`     | Estilos de la aplicación.                                   |

---

## 🚀 Instalación y Ejecución

### 1. Clona el repositorio

```bash
git clone https://github.com/BrayanCLR/buscador-peliculas.git
```

### 2. Ingresa al directorio del proyecto

```bash
cd buscador-peliculas
```

### 3. Instala las dependencias

```bash
npm install
```

### 4. Crea un archivo `.env` en la raíz del proyecto

```env
VITE_TMDB_API_KEY=tu_api_key
```

Puedes obtener una API Key gratuita creando una cuenta en:

https://www.themoviedb.org/

### 5. Ejecuta el servidor de desarrollo

```bash
npm run dev
```

### 6. Genera la versión de producción

```bash
npm run build
```

---

## 🔑 API Utilizada

Este proyecto utiliza la API de The Movie Database (TMDB):

* Sitio oficial: https://www.themoviedb.org/
* Documentación: https://developer.themoviedb.org/

---

## 🎯 Objetivos de Aprendizaje

Este proyecto fue desarrollado con el propósito de practicar:

* Consumo de APIs REST.
* Programación asíncrona con `fetch`, `async` y `await`.
* Manipulación del DOM.
* Modularización con ES Modules.
* Organización de proyectos frontend.
* Manejo de estados y errores.
* Uso de variables de entorno con Vite.

---

## 📸 Vista Previa

<img width="1920" height="1020" alt="Buscador de Películas y Series" src="https://github.com/user-attachments/assets/09dfcc91-0e13-4e26-92ab-cf2e330fd184" />

---

## 👨‍💻 Autor

**Brayan López**

Proyecto desarrollado como parte de mi proceso de aprendizaje en **Desarrollo Fullstack**, enfocado en fortalecer mis fundamentos de JavaScript, consumo de APIs y arquitectura de aplicaciones frontend.

---

## 📄 Licencia

Este proyecto se distribuye únicamente con fines educativos y de aprendizaje.