# MyBooks Vue

MyBooks es una aplicación web para gestionar tu biblioteca personal, desarrollada con Vue 3 y Vite. La aplicación permite a los usuarios:

- Agregar libros a su biblioteca personal
- Gestionar una lista de deseos (wishlist) de libros
- Visualizar estadísticas sobre su colección
- Encontrar librerías cercanas utilizando Google Maps

## Guía de Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local:

### Prerrequisitos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/) (v8 o superior)
- Una clave de API de Google Maps con las APIs de Maps JavaScript y Places habilitadas

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd mybooks-vue
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar las variables de entorno**

   Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

   ```
   VITE_GOOGLE_MAPS_API_KEY=TU_CLAVE_API_DE_GOOGLE_MAPS
   ```

   Reemplaza `TU_CLAVE_API_DE_GOOGLE_MAPS` con tu clave de API de Google Maps.

4. **Iniciar el servidor de desarrollo**

   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`.

## Estructura y Funcionamiento de la Aplicación

MyBooks es una aplicación SPA (Single Page Application) que te permite gestionar tu colección personal de libros. A continuación, se detallan las principales funcionalidades y cómo está estructurada.

### Funcionalidades Principales

#### 1. Página de Inicio
- Muestra un resumen de la biblioteca del usuario
- Acceso rápido a todas las secciones de la aplicación

#### 2. Agregar Libros
- Búsqueda de libros por título
- Formulario para añadir libros a la biblioteca personal
- Opción para categorizar los libros (leídos, por leer, etc.)

#### 3. Biblioteca Personal
- Visualización de todos los libros en la colección
- Acciones rápidas como editar o eliminar libros

#### 4. Lista de Deseos (Wishlist)
- Gestión de libros que el usuario desea leer
- Priorización de los libros en la lista

#### 5. Estadísticas
- Visualización de gráficos sobre hábitos de lectura
- Distribución de géneros.
- Seguimiento de progreso de lectura

#### 6. Librerías Cercanas
- Utiliza la API de Google Maps para mostrar librerías cercanas
- Muestra información detallada de cada librería (nombre, dirección, sitio web)
- Permite visualizar la ruta hacia la librería seleccionada

### Tecnologías Utilizadas

#### Frontend
- **Vue 3**: Framework JavaScript progresivo para construir interfaces de usuario
- **Composition API**: Utilizado con `<script setup>` para una mejor organización del código
- **Vue Router**: Para la navegación entre diferentes páginas de la aplicación
- **Pinia**: Gestión del estado global de la aplicación
- **Vite**: Herramienta de construcción que proporciona un servidor de desarrollo rápido

#### Estilos y UI
- **Tailwind CSS**: Framework de CSS utilitario para un diseño rápido y consistente
- **Chart.js & Vue-ChartJS**: Para la visualización de datos en la sección de estadísticas

#### APIs y Servicios Externos
- **Google Maps JavaScript API**: Para mostrar mapas interactivos
- **Google Places API**: Para buscar librerías cercanas a la ubicación del usuario

#### Persistencia de Datos
- Almacenamiento local utilizando `localStorage` para guardar la biblioteca del usuario
- Gestión del estado global con Pinia para mantener los datos sincronizados entre componentes

## Arquitectura de la Aplicación

### Componentes Principales

La aplicación está organizada en varios componentes clave:

- **App.vue**: Componente raíz que contiene la navegación principal y el enrutador
- **Pages**: Componentes de nivel superior para cada página principal:
  - `Home.vue`: Página de inicio
  - `Library.vue`: Gestión de la biblioteca
  - `Bookshelf.vue`: Visualización de la colección de libros
  - `Wishlist.vue`: Gestión de la lista de deseos
  - `Stats.vue`: Visualización de estadísticas
  - `BookstoresMap.vue`: Mapa de librerías cercanas

### Sistema de Rutas

El enrutamiento se maneja a través de `vue-router` configurado en `src/router/index.js`. Las rutas principales son:

- `/`: Página de inicio
- `/library`: Página para agregar libros
- `/bookshelf`: Biblioteca personal
- `/wishlist`: Lista de deseos
- `/stats`: Estadísticas
- `/bookstores`: Mapa de librerías cercanas

### Gestión del Estado

La gestión del estado se realiza utilizando Pinia, con las siguientes tiendas principales:

- **bookStore.js**: Maneja el estado de los libros en la biblioteca y la wishlist

### Funciones Destacadas

#### Mapas de Librerías Cercanas

La funcionalidad de mapas utiliza las APIs de Google Maps y Places para:

1. Solicitar la ubicación del usuario
2. Cargar un mapa centrado en esa ubicación
3. Buscar librerías en un radio de 5 km
4. Mostrar marcadores para cada librería encontrada
5. Mostrar información detallada al hacer clic en un marcador
6. Permitir abrir cada ubicación en Google Maps

## Problemas Conocidos y Soluciones

### Problemas con Google Maps API

Si el mapa no se carga correctamente:

1. Verifica que tu clave API de Google Maps es válida
2. Asegúrate de que las APIs de Maps JavaScript y Places estén habilitadas
3. Revisa la consola del navegador para ver posibles errores
4. Comprueba que el archivo `.env` esté correctamente configurado

### Persistencia de Datos

Actualmente la aplicación utiliza `localStorage` para almacenar los datos, lo que significa:
- Los datos se guardan solo en el navegador del usuario
- No hay sincronización entre diferentes dispositivos
- Si el usuario limpia los datos del navegador, se perderá su biblioteca
