<template>
  <div class="space-y-6">
    <h2 class="text-3xl font-semibold text-indigo-700 mb-4">Librerías Cercanas</h2>
    
    <!-- Mensaje de permiso de ubicación -->
    <div v-if="!locationPermission" class="bg-white p-6 rounded-lg shadow-md mb-4">
      <p class="mb-4">Para encontrar librerías cercanas, necesitamos acceso a tu ubicación.</p>
      <button 
        @click="requestLocation" 
        class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        Permitir ubicación
      </button>
    </div>
    
    <!-- Indicador de carga -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-gray-600">Buscando librerías cercanas...</p>
    </div>
    
    <!-- Contenido principal - siempre visible para el mapa -->
    <div class="mt-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Listado de librerías a la izquierda -->
        <div class="md:col-span-1">
          <div class="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 class="text-xl font-semibold mb-4">Librerías cercanas</h3>
            
            <div v-if="libraries.length > 0" class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              <div 
                v-for="(library, index) in libraries" 
                :key="index" 
                class="flex items-start border-b border-gray-100 pb-4 last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
                @click="showOnMap(library)"
              >
                <div class="bg-indigo-100 text-indigo-700 font-bold text-lg rounded-full w-8 h-8 flex items-center justify-center mr-4">
                  {{ index + 1 }}
                </div>
                <div>
                  <h4 class="font-medium text-lg">{{ library.name }}</h4>
                  <p class="text-gray-600">{{ library.vicinity || library.address }}</p>
                  <p class="text-gray-500 text-sm mt-1">{{ library.distance.toFixed(1) }} km de distancia</p>
                  <a 
                    v-if="library.place_id" 
                    :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(library.name)}&query_place_id=${library.place_id}`" 
                    target="_blank" 
                    class="text-indigo-600 text-sm hover:underline inline-flex items-center mt-2"
                    @click.stop
                  >
                    Abrir en Google Maps
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <p v-if="library.website" class="mt-1">
                    <a 
                      :href="library.website" 
                      target="_blank" 
                      class="text-indigo-600 text-sm hover:underline inline-flex items-center"
                      @click.stop
                    >
                      Visitar sitio web
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </p>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-4">
              <p class="text-gray-600">No se encontraron librerías cercanas.</p>
            </div>
            
            <button 
              @click="searchNearbyLibraries" 
              class="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              {{ libraries.length > 0 ? 'Actualizar resultados' : 'Buscar librerías' }}
            </button>
          </div>
        </div>
        
        <!-- Mapa a la derecha -->
        <div class="md:col-span-2">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <!-- Usamos solo un div simple para el mapa -->
            <div id="map" class="w-full h-[500px] rounded-md" style="background-color: #f3f4f6;"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="error" class="bg-red-100 text-red-800 p-4 rounded-lg mt-4">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Loader } from '@googlemaps/js-api-loader' // Importamos el Loader de Google Maps

// Estado para la ubicación y permisos
const locationPermission = ref(false)
const currentLocation = ref({ latitude: 0, longitude: 0 })
const libraries = ref([])
const loading = ref(true) // Comenzamos con loading en true
const error = ref(null)

// Variables para manejar el mapa
let map = null
let markers = []
let userMarker = null
let google = null // Referencia a la API de Google Maps

// Configurar el loader de Google Maps
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places"]
})

// Comprobar si ya tenemos permisos de ubicación al cargar la página
onMounted(async () => {
  loading.value = true
  
  try {
    // Cargar la API de Google Maps primero
    google = await loadGoogleMapsAPI()
    console.log('Google Maps API cargada en onMounted')
    
    // PRUEBA: Inicializar el mapa con una ubicación predeterminada de inmediato
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mapDiv = document.getElementById('map')
    console.log('Elemento del mapa en onMounted:', !!mapDiv)
    
    if (mapDiv && google && google.maps) {
      // Crear un mapa simple con una ubicación predeterminada
      map = new google.maps.Map(mapDiv, {
        center: { lat: -33.45, lng: -70.67 }, // Santiago, Chile
        zoom: 12
      })
      console.log('Mapa creado en onMounted:', !!map)
      
      // Añadir marcador para la ubicación predeterminada
      try {
        const defaultLat = -33.45;
        const defaultLng = -70.67;
        
        if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
          const markerPosition = { lat: defaultLat, lng: defaultLng }
          const pinElement = document.createElement('div')
          pinElement.style.width = '24px'
          pinElement.style.height = '24px'
          pinElement.style.borderRadius = '50%'
          pinElement.style.backgroundColor = '#4338ca'
          pinElement.style.border = '3px solid white'
          pinElement.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)'
          
          userMarker = new google.maps.marker.AdvancedMarkerElement({
            position: markerPosition,
            map: map,
            title: "Ubicación predeterminada",
            content: pinElement
          })
        } else {
          userMarker = new google.maps.Marker({
            position: { lat: defaultLat, lng: defaultLng },
            map: map,
            title: "Ubicación predeterminada",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#4338ca",
              fillOpacity: 0.8,
              strokeColor: "white",
              strokeWeight: 2
            }
          })
        }
      } catch (markerError) {
        console.error('Error al crear marcador en onMounted:', markerError)
      }
    }
    
    // Luego verificar permisos de ubicación
    const permissionResult = await navigator.permissions.query({ name: 'geolocation' })
    if (permissionResult.state === 'granted') {
      locationPermission.value = true
      await getCurrentLocation()
    } else {
      loading.value = false
    }
  } catch (err) {
    console.error('Error during initialization:', err)
    error.value = 'Error al cargar Google Maps. Por favor recarga la página.'
    loading.value = false
  }
})

// Solicitar permisos de ubicación
const requestLocation = async () => {
  if (navigator.geolocation) {
    loading.value = true
    navigator.geolocation.getCurrentPosition(
      async position => {
        locationPermission.value = true
        currentLocation.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        
        // Asegurar que la API de Google Maps está cargada
        if (!google) {
          try {
            await loadGoogleMapsAPI()
          } catch (err) {
            error.value = `Error al cargar Google Maps: ${err.message}`
            loading.value = false
            return
          }
        }
        
        loading.value = false
        await createMap()
        searchNearbyLibraries()
      },
      err => {
        loading.value = false
        error.value = `Error al obtener la ubicación: ${err.message}`
      }
    )
  } else {
    error.value = "Tu navegador no soporta geolocalización"
  }
}

// Obtener ubicación actual
const getCurrentLocation = async () => {
  if (navigator.geolocation) {
    loading.value = true
    navigator.geolocation.getCurrentPosition(
      async position => {
        currentLocation.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        
        // Asegurar que la API de Google Maps está cargada
        if (!google) {
          try {
            await loadGoogleMapsAPI()
          } catch (err) {
            error.value = `Error al cargar Google Maps: ${err.message}`
            loading.value = false
            return
          }
        }
        
        loading.value = false
        await createMap()
        searchNearbyLibraries()
      },
      err => {
        loading.value = false
        error.value = `Error al obtener la ubicación: ${err.message}`
      }
    )
  } else {
    error.value = "Tu navegador no soporta geolocalización"
  }
}

// Referencia al elemento del mapa
const mapRef = ref(null)

// Crear el mapa
const createMap = async () => {
  console.log('Iniciando createMap...')
  
  // Esperar un momento para asegurarnos de que el DOM se ha renderizado completamente
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Buscar el elemento del mapa por su ID directamente
  const mapDiv = document.getElementById('map')
  console.log('¿Existe el elemento map? (búsqueda directa por ID)', !!mapDiv)
  console.log('¿Dimensiones del div del mapa?', mapDiv ? `${mapDiv.offsetWidth}x${mapDiv.offsetHeight}` : 'N/A')
  console.log('¿Google está cargado?', !!google, !!google?.maps)
  
  if (mapDiv && google && google.maps) {
    console.log('Creando mapa de Google en el elemento encontrado...')
    const { latitude, longitude } = currentLocation.value
    
    try {
      // Primero asegurarnos de limpiar el contenido del div
      mapDiv.innerHTML = ''
      
      // Crear el mapa centrado en la ubicación actual - versión más básica posible
      map = new google.maps.Map(mapDiv, {
        center: { lat: latitude, lng: longitude },
        zoom: 14,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false
      })
      
      // Añadir marcador para la ubicación actual
      try {
        if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
          // Usar AdvancedMarkerElement si está disponible
          const markerPosition = { lat: latitude, lng: longitude }
          const pinElement = document.createElement('div')
          pinElement.style.width = '24px'
          pinElement.style.height = '24px'
          pinElement.style.borderRadius = '50%'
          pinElement.style.backgroundColor = '#4338ca' // Índigo más oscuro
          pinElement.style.border = '3px solid white'
          pinElement.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)'
          
          userMarker = new google.maps.marker.AdvancedMarkerElement({
            position: markerPosition,
            map: map,
            title: "Tu ubicación",
            content: pinElement
          })
        } else {
          // Fallback a Marker tradicional
          userMarker = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map,
            title: "Tu ubicación",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#4338ca",
              fillOpacity: 0.8,
              strokeColor: "white",
              strokeWeight: 2
            }
          })
        }
        console.log('Marcador de ubicación actual creado:', !!userMarker)
      } catch (markerError) {
        console.error('Error al crear marcador de ubicación actual:', markerError)
      }
      
      console.log('Mapa creado exitosamente:', !!map)
      return true
    } catch (err) {
      console.error('Error al crear mapa:', err)
      error.value = `Error al crear mapa: ${err.message}`
      return false
    }
  } else {
    error.value = "No se pudo cargar el mapa de Google. Por favor, recarga la página."
    console.error("No se pudo crear el mapa por falta de dependencias:", { 
      mapDiv: !!mapDiv, 
      google: !!google, 
      googleMaps: !!google?.maps 
    })
    return false
  }
}

// Buscar librerías cercanas
const searchNearbyLibraries = async () => {
  // Asegurarnos de que la API de Google Maps esté cargada
  if (!google) {
    try {
      await loadGoogleMapsAPI()
    } catch (err) {
      error.value = `Error al cargar Google Maps: ${err.message}`
      loading.value = false
      return
    }
  }
  
  // Asegurarnos de que el mapa esté inicializado
  if (!map) {
    const mapCreated = await createMap()
    if (!mapCreated) {
      error.value = "No se pudo inicializar el mapa."
      loading.value = false
      return
    }
  }
  
  try {
    loading.value = true
    error.value = null
    libraries.value = []
    
    // Limpiar marcadores previos
    if (markers && markers.length) {
      markers.forEach(marker => marker.setMap(null))
      markers = []
    }
    
    // Usar la API Places para buscar librerías cercanas
    const request = {
      location: { 
        lat: currentLocation.value.latitude, 
        lng: currentLocation.value.longitude 
      },
      radius: 5000, // 5km
      type: 'book_store' // Tipo para librerías
    }
    
    const service = new google.maps.places.PlacesService(map)
    
    service.nearbySearch(request, (results, status) => {
      loading.value = false
      
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        // Procesar resultados
        const placesWithCoords = results
          .filter(place => place.geometry && place.geometry.location)
          .map(place => {
            // Calcular distancia
            const distance = calculateDistance(
              currentLocation.value.latitude,
              currentLocation.value.longitude,
              place.geometry.location.lat(),
              place.geometry.location.lng()
            )
            
            return {
              name: place.name,
              vicinity: place.vicinity,
              location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              },
              distance,
              place_id: place.place_id,
              website: null
            }
          })
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5) // Limitar a 5 resultados
        
        libraries.value = placesWithCoords
        
        // Obtener detalles adicionales (sitio web) para cada librería
        placesWithCoords.forEach((library, index) => {
          service.getDetails(
            { 
              placeId: library.place_id,
              fields: ['website', 'url'] 
            },
            (place, detailStatus) => {
              if (detailStatus === google.maps.places.PlacesServiceStatus.OK && place && place.website) {
                libraries.value[index].website = place.website
              }
            }
          )
        })
        
        // Añadir marcadores para las librerías
        libraries.value.forEach((library, index) => {
          let marker
          
          try {
            // Preparar el contenido del infoWindow (igual para ambos tipos de marcadores)
            const infoWindowContent = `
              <div>
                <h3 style="font-weight: bold; margin-bottom: 4px;">${library.name}</h3>
                <p>${library.vicinity || ''}</p>
                <p>${library.distance.toFixed(1)} km</p>
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(library.name)}&query_place_id=${library.place_id}" 
                  target="_blank" style="color: #4F46E5; text-decoration: underline; font-size: 12px;">
                  Abrir en Google Maps
                </a>
              </div>
            `;

            const infoWindow = new google.maps.InfoWindow({
              content: infoWindowContent
            });
            
            // Usar AdvancedMarkerElement si está disponible
            if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
              const markerDiv = document.createElement('div')
              markerDiv.className = 'custom-marker'
              markerDiv.style.backgroundColor = '#4F46E5'
              markerDiv.style.color = 'white'
              markerDiv.style.padding = '4px 8px'
              markerDiv.style.borderRadius = '50%'
              markerDiv.style.fontWeight = 'bold'
              markerDiv.style.width = '24px'
              markerDiv.style.height = '24px'
              markerDiv.style.display = 'flex'
              markerDiv.style.justifyContent = 'center'
              markerDiv.style.alignItems = 'center'
              markerDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)'
              markerDiv.innerHTML = (index + 1).toString()
              
              marker = new google.maps.marker.AdvancedMarkerElement({
                position: library.location,
                map: map,
                title: library.name,
                content: markerDiv
              })
              
              // Agregar manualmente el listener de clic para AdvancedMarkerElement
              marker.addListener('click', () => {
                infoWindow.open(map, marker)
              })
            } else {
              // Usar el marcador tradicional como fallback
              marker = new google.maps.Marker({
                position: library.location,
                map: map,
                title: library.name,
                label: {
                  text: (index + 1).toString(),
                  color: 'white'
                }
              })
              
              // Agregar listener de clic al marcador tradicional
              marker.addListener('click', () => {
                infoWindow.open(map, marker)
              })
            }
          } catch (err) {
            console.error(`Error al crear marcador para ${library.name}:`, err)
            
            // Fallback al marcador más simple posible en caso de error
            marker = new google.maps.Marker({
              position: library.location,
              map: map,
              title: library.name,
              label: (index + 1).toString()
            })
            
            // InfoWindow simple en caso de error
            const simpleInfoWindow = new google.maps.InfoWindow({
              content: `<div><h3>${library.name}</h3><p>${library.vicinity || ''}</p></div>`
            })
            
            marker.addListener('click', () => {
              simpleInfoWindow.open(map, marker)
            })
          }
          
          markers.push(marker)
        })
        
        // Ajustar mapa para mostrar todos los marcadores si hay resultados
        if (libraries.value.length > 0) {
          const bounds = new google.maps.LatLngBounds()
          bounds.extend({ 
            lat: currentLocation.value.latitude, 
            lng: currentLocation.value.longitude 
          })
          
          libraries.value.forEach(library => {
            bounds.extend(library.location)
          })
          
          map.fitBounds(bounds)
        }
      } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        // No hay resultados pero no es un error
        libraries.value = []
        error.value = null
      } else {
        // Otros códigos de error
        error.value = "No se pudieron encontrar librerías cercanas. Por favor intenta nuevamente."
        console.error(`Error en Places API: ${status}`)
      }
    })
  } catch (err) {
    loading.value = false
    error.value = `Error al buscar librerías: ${err.message}`
  }
}

// Mostrar una librería específica en el mapa
const showOnMap = (library) => {
  try {
    if (map) {
      map.setCenter(library.location)
      map.setZoom(16)
      
      // Encontrar el marcador correspondiente
      const markerIndex = libraries.value.findIndex(l => 
        l.place_id === library.place_id
      )
      
      if (markerIndex !== -1 && markers[markerIndex]) {
        try {
          // Simular clic en el marcador para mostrar info
          if (google.maps.marker && 
              google.maps.marker.AdvancedMarkerElement && 
              markers[markerIndex] instanceof google.maps.marker.AdvancedMarkerElement &&
              markers[markerIndex].element) {
            // Disparar evento en AdvancedMarkerElement
            markers[markerIndex].element.click()
          } else {
            // Disparar evento en Marker tradicional
            google.maps.event.trigger(markers[markerIndex], 'click')
          }
        } catch (clickErr) {
          console.error('Error al simular clic en marcador:', clickErr)
        }
      }
    }
  } catch (err) {
    console.error('Error al mostrar librería en mapa:', err)
  }
}

// Función para calcular distancia entre dos puntos (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c // Distancia en km
}

// Función para cargar la API de Google Maps
const loadGoogleMapsAPI = async () => {
  try {
    console.log('Intentando cargar API de Google Maps con key:', GOOGLE_MAPS_API_KEY)
    google = await loader.load()
    console.log('API de Google Maps cargada exitosamente:', !!google)
    console.log('Maps disponible:', !!google?.maps)
    console.log('Places disponible:', !!google?.maps?.places)
    return google
  } catch (error) {
    console.error('Error loading Google Maps API:', error)
    throw new Error('Failed to load Google Maps API')
  }
}

// Función para verificar si la API de Google Maps está lista
const isGoogleMapsLoaded = () => {
  return google && google.maps
}
</script>

<style scoped>
/* Estilos para asegurar que el mapa se renderice correctamente */
#map {
  min-height: 350px !important;
  width: 100% !important;
  height: 500px !important;
  border-radius: 0.375rem !important;
  position: relative !important;
  overflow: hidden !important;
  display: block !important;
}

@media (max-width: 768px) {
  #map {
    height: 50vh !important;
    margin-top: 1rem !important;
  }
}

/* Estilos para los marcadores personalizados */
.custom-marker {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #4F46E5;
  color: white;
  border-radius: 50%;
  font-weight: bold;
}
</style>
