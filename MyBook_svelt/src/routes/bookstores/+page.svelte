<script>
    import { onMount } from 'svelte';
    import { Loader } from '@googlemaps/js-api-loader';

    let map;
    let searchInput;
    let markers = [];
    let infoWindow;
    let loading = true;
    let error = null;

    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const loader = new Loader({
        apiKey: GOOGLE_MAPS_API_KEY,
        version: "weekly",
        libraries: ["places"]
    });

    async function initMap() {
        try {
            const google = await loader.load();
            
            // Get user's location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        // Initialize map
                        map = new google.maps.Map(document.getElementById("map"), {
                            center: userLocation,
                            zoom: 13,
                            styles: [
                                {
                                    featureType: "poi",
                                    elementType: "labels",
                                    stylers: [{ visibility: "off" }]
                                }
                            ]
                        });

                        // Add search box
                        const input = document.getElementById("searchInput");
                        const searchBox = new google.maps.places.SearchBox(input);

                        // Bias SearchBox results towards current map's viewport
                        map.addListener("bounds_changed", () => {
                            searchBox.setBounds(map.getBounds());
                        });

                        // Search for bookstores near user location
                        searchNearbyBookstores(userLocation);

                        // Listen for search box changes
                        searchBox.addListener("places_changed", () => {
                            const places = searchBox.getPlaces();
                            if (places.length === 0) return;

                            // Clear existing markers
                            clearMarkers();

                            // Add new markers
                            const bounds = new google.maps.LatLngBounds();
                            places.forEach(place => {
                                if (!place.geometry || !place.geometry.location) return;
                                addMarker(place);
                                bounds.extend(place.geometry.location);
                            });

                            map.fitBounds(bounds);
                        });

                        loading = false;
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                        initMapWithDefaultLocation();
                    }
                );
            } else {
                console.log("Geolocation is not supported by this browser.");
                initMapWithDefaultLocation();
            }
        } catch (err) {
            error = "Failed to load Google Maps. Please try again later.";
            loading = false;
            console.error("Error loading Google Maps:", err);
        }
    }

    function initMapWithDefaultLocation() {
        const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // New York
        map = new google.maps.Map(document.getElementById("map"), {
            center: defaultLocation,
            zoom: 12
        });
        loading = false;
    }

    function clearMarkers() {
        markers.forEach(marker => marker.setMap(null));
        markers = [];
    }

    async function searchNearbyBookstores(location) {
        const service = new google.maps.places.PlacesService(map);
        const request = {
            location: location,
            radius: 5000,
            type: ['book_store']
        };

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                clearMarkers();
                results.forEach(place => addMarker(place));
            }
        });
    }

    function addMarker(place) {
        if (!place.geometry || !place.geometry.location) return;

        const marker = new google.maps.Marker({
            map,
            position: place.geometry.location,
            title: place.name,
            animation: google.maps.Animation.DROP
        });

        markers.push(marker);

        // Create info window content
        const content = `
            <div class="info-window">
                <h3>${place.name}</h3>
                ${place.vicinity ? `<p>${place.vicinity}</p>` : ''}
                ${place.rating ? `
                    <p>Rating: ${place.rating} ⭐ (${place.user_ratings_total} reviews)</p>
                ` : ''}
                ${place.opening_hours?.isOpen() ? 
                    '<p class="open">Open now</p>' : 
                    '<p class="closed">Closed</p>'
                }
            </div>
        `;

        // Add click listener to marker
        marker.addListener("click", () => {
            if (infoWindow) infoWindow.close();
            infoWindow = new google.maps.InfoWindow({
                content: content
            });
            infoWindow.open(map, marker);
        });
    }

    onMount(() => {
        initMap();
    });
</script>

<svelte:head>
    <title>Find Bookstores - MyBooks</title>
</svelte:head>

<div class="container">
    <h1>Find Local Bookstores</h1>
    <div class="search-container">
        <input 
            id="searchInput"
            type="text"
            placeholder="Search for bookstores..."
            bind:this={searchInput}
        />
    </div>
    {#if loading}
        <div class="loading">Loading map...</div>
    {:else if error}
        <div class="error">{error}</div>
    {/if}
    <div id="map"></div>
</div>

<style>
    .container {
        padding: 1rem;
        height: calc(100vh - 150px);
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    h1 {
        margin: 0;
        color: #2c3e50;
    }

    .search-container {
        width: 100%;
    }

    input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    input:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
    }

    #map {
        flex: 1;
        min-height: 400px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .loading, .error {
        text-align: center;
        padding: 2rem;
        background: #f8f9fa;
        border-radius: 8px;
    }

    .error {
        color: #e74c3c;
    }

    :global(.info-window) {
        padding: 0.5rem;
        max-width: 300px;
    }

    :global(.info-window h3) {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
        font-size: 1.1rem;
    }

    :global(.info-window p) {
        margin: 0.25rem 0;
        color: #666;
        font-size: 0.9rem;
    }

    :global(.info-window .open) {
        color: #27ae60;
        font-weight: bold;
    }

    :global(.info-window .closed) {
        color: #e74c3c;
        font-weight: bold;
    }
</style>