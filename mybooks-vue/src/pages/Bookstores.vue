<template>
  <div class="space-y-6">
    <h2 class="text-3xl font-semibold text-indigo-700 mb-4">Librerías Cercanas</h2>
    
    <div v-if="!locationPermission" class="bg-white p-6 rounded-lg shadow-md mb-4">
      <p class="mb-4">Para encontrar librerías cercanas, necesitamos acceso a tu ubicación.</p>
      <button 
        @click="requestLocation" 
        class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        Permitir ubicación
      </button>
    </div>
    
    <div v-else-if="loading" class="text-center py-8">
      <div class="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-gray-600">Buscando librerías cercanas...</p>
    </div>
    
    <div v-else>
      <!-- Librerías cercanas -->
      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 class="text-xl font-semibold mb-4">Librerías más cercanas a ti</h3>
        
        <div v-if="libraries.length > 0" class="space-y-4">
          <div v-for="(library, index) in limitedLibraries" :key="index" class="flex items-start border-b border-gray-100 pb-4 last:border-0">
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
              >
                Abrir en Google Maps
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-4">
          <p class="text-gray-600">No se encontraron librerías cercanas.</p>
          <button 
            @click="searchNearbyLibraries" 
            class="mt-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Buscar librerías
          </button>
        </div>
      </div>
      
      <button 
        v-if="libraries.length > 0"
        @click="searchNearbyLibraries" 
        class="bg-indigo-100 text-indigo-700 px-4 py-2 rounded hover:bg-indigo-200 transition"
      >
        Actualizar resultados
      </button>
    </div>
    
    <div v-if="error" class="bg-red-100 text-red-800 p-4 rounded-lg mt-4">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Estado para la ubicación y permisos
const locationPermission = ref(false)
const currentLocation = ref({ latitude: 0, longitude: 0 })
const libraries = ref([])
const loading = ref(false)
const error = ref(null)

// Limitar a mostrar solo las 3 librerías más cercanas
const limitedLibraries = computed(() => {
  return libraries.value.slice(0, 3)
})

// Comprobar si ya tenemos permisos de ubicación al cargar la página
onMounted(() => {
  navigator.permissions.query({ name: 'geolocation' }).then(result => {
    if (result.state === 'granted') {
      locationPermission.value = true
      getCurrentLocation()
    }
  })
})

// Solicitar permisos de ubicación
const requestLocation = () => {
  if (navigator.geolocation) {
    loading.value = true
    navigator.geolocation.getCurrentPosition(
      position => {
        locationPermission.value = true
        currentLocation.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        loading.value = false
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
const getCurrentLocation = () => {
  if (navigator.geolocation) {
    loading.value = true
    navigator.geolocation.getCurrentPosition(
      position => {
        currentLocation.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        loading.value = false
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

// Crear el mapa
const createMap = () => {
  const mapDiv = document.getElementById('map')
  if (mapDiv && google) {
    const { latitude, longitude } = currentLocation.value
    
    // Crear el mapa centrado en la ubicación actual
    map = new google.maps.Map(mapDiv, {
      center: { lat: latitude, lng: longitude },
      zoom: 14,
      styles: [
        {
          featureType: "poi.business",
          stylers: [{ visibility: "on" }]
        }
      ]
    })
    
    // Añadir marcador para la ubicación actual
    userMarker = new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      title: "Tu ubicación",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#4F46E5",
        fillOpacity: 0.8,
        strokeColor: "white",
        strokeWeight: 2
      }
    })
  }
}

// Buscar librerías cercanas
const searchNearbyLibraries = async () => {
  if (!map) return
  
  try {
    loading.value = true
    error.value = null
    libraries.value = []
    
    // Limpiar marcadores previos
    markers.forEach(marker => marker.setMap(null))
    markers = []
    
    // Usar la API Places actualizada
    // Se crea un objeto request para usar con la API
    const request = {
      location: { 
        lat: currentLocation.value.latitude, 
        lng: currentLocation.value.longitude 
      },
      radius: 5000, // 5km
      type: 'book_store' // Tipo para librerías
    };
    
    try {
      // Usamos fetch para llamar directamente a la API de Places 
      const endpoint = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg';
      
      // Método alternativo utilizando PlacesService pero con manejo de errores mejorado
      const service = new google.maps.places.PlacesService(map);
      
      service.nearbySearch(request, (results, status) => {
        loading.value = false;
        
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          // Procesar resultados
          libraries.value = results.map(place => {
            // Verificar que place.geometry y place.geometry.location existan
            if (!place.geometry || !place.geometry.location) {
              return null;
            }
            
            // Calcular distancia
            const distance = calculateDistance(
              currentLocation.value.latitude,
              currentLocation.value.longitude,
              place.geometry.location.lat(),
              place.geometry.location.lng()
            );
            
            return {
              name: place.name,
              vicinity: place.vicinity,
              location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              },
              distance,
              place_id: place.place_id
            };
          })
          .filter(item => item !== null) // Eliminar elementos nulos
          .sort((a, b) => a.distance - b.distance);
        
        // Añadir marcadores para las librerías
        libraries.value.forEach((library, index) => {
          const marker = new google.maps.Marker({
            position: library.location,
            map: map,
            title: library.name,
            label: {
              text: (index + 1).toString(),
              color: 'white'
            }
          })
          
          // Información al hacer clic
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div>
                <h3 style="font-weight: bold; margin-bottom: 4px;">${library.name}</h3>
                <p>${library.vicinity || ''}</p>
                <p>${library.distance.toFixed(1)} km</p>
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(library.name)}&query_place_id=${library.place_id}" 
                  target="_blank" style="color: #4F46E5; text-decoration: underline; font-size: 12px;">
                  Abrir en Google Maps
                </a>
              </div>
            `
          })
          
          marker.addListener('click', () => {
            infoWindow.open(map, marker)
          })
          
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
      } else {
        error.value = "No se encontraron librerías cercanas."
      }
    })
    
  } catch (err) {
    loading.value = false
    error.value = `Error al buscar librerías: ${err.message}`
  }
}

// Mostrar una librería específica en el mapa
const showOnMap = (library) => {
  if (map) {
    map.setCenter(library.location)
    map.setZoom(16)
    
    // Encontrar el marcador correspondiente
    const marker = markers.find(m => 
      m.getPosition().lat() === library.location.lat && 
      m.getPosition().lng() === library.location.lng
    )
    
    if (marker) {
      // Simular clic en el marcador para mostrar info
      google.maps.event.trigger(marker, 'click')
    }
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
</script>

<style scoped>
/* Estilos para asegurar que el mapa se renderice correctamente */
#map {
  min-height: 350px;
}

@media (max-width: 768px) {
  #map {
    height: 50vh;
    margin-top: 1rem;
  }
}
</style>
