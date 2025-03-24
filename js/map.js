// map.js - Map initialization and functionality

// Map instance
let map = null;
let markers = [];
let detailMap = null;

window.addEventListener('resize', function() {
    if (map) {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }
});

/**
 * Initialize the Leaflet map
 * @param {string} elementId - ID of the HTML element to contain the map
 */
function initMap(elementId) {
    console.log('Initializing map...');
    
    // Create map centered on Esquimalt, Canada
    map = L.map(elementId).setView([48.430, -123.430], 13);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Handle map load event
    map.on('load', function() {
        setTimeout(function() {
            map.invalidateSize();
        }, 100);
    });
    
    console.log('Map initialized successfully');
    return map;
}

/**
 * Get marker color based on item category
 * @param {string} category - Item category
 * @returns {string} - Hex color code
 */
function getMarkerColor(category) {
    switch (category) {
        case "Military":
            return "#34568B"; // navy blue
        case "Indigenous":
            return "#805ad5"; // purple
        case "Architecture":
            return "#3182ce"; // blue
        case "Maritime":
            return "#2C9F45"; // green
        case "Museum":
            return "#DD4124"; // red-orange
        case "Natural":
            return "#006B54"; // forest green
        default:
            return "#718096"; // gray
    }
}

/**
 * Create custom marker icon
 * @param {Object} item - Cultural item data
 * @returns {L.divIcon} - Leaflet div icon
 */
function createCustomMarkerIcon(item) {
    const color = getMarkerColor(item.category);
    
    return L.divIcon({
        className: 'custom-marker-icon',
        html: `<div style="width: 30px; height: 30px; background-color: ${color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${item.id}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
}

/**
 * Create popup content for a marker
 * @param {Object} item - Cultural item data
 * @returns {string} - HTML content for popup
 */
function createPopupContent(item) {
    return `
        <div class="p-2">
            <h3 class="popup-title">${item.title}</h3>
            <p class="popup-category">${item.category} | ${item.period}</p>
            <button class="popup-action view-details-btn" data-id="${item.id}">
                View Details →
            </button>
        </div>
    `;
}

/**
 * Render map markers based on data
 * @param {Array} data - Array of cultural items
 * @param {Function} markerClickCallback - Callback function for marker click
 */
function renderMapMarkers(data, markerClickCallback) {
    console.log(`Rendering ${data.length} markers on map`);
    
    // Clear existing markers
    if (markers.length > 0) {
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
    }
    
    // Add new markers based on data
    data.forEach(item => {
        const marker = L.marker([item.location.lat, item.location.lng], {
            icon: createCustomMarkerIcon(item)
        }).addTo(map);
        
        // Create popup content
        const popupContent = createPopupContent(item);
        
        // Create popup
        const popup = L.popup({
            className: 'custom-popup'
        }).setContent(popupContent);
        
        // Add popup to marker
        marker.bindPopup(popup);
        
        // Add click event
        marker.on('click', () => {
            marker.openPopup();
        });
        
        // Add click event for "View Details" button in popup
        marker.on('popupopen', () => {
            setTimeout(() => {  // Add a small delay to ensure DOM is ready
                const viewDetailsBtn = document.querySelector(`.view-details-btn[data-id="${item.id}"]`);
                if (viewDetailsBtn) {
                    viewDetailsBtn.addEventListener('click', () => {
                        markerClickCallback(item);
                    });
                }
            }, 10);
        });
        
        // Add marker to array for later reference
        markers.push(marker);
    });
    
    // If we have markers, fit the map to show all markers
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

/**
 * Initialize a detail map for item details view
 * @param {string} elementId - ID of the HTML element to contain the map
 * @param {Object} item - Cultural item data
 */
function initDetailMap(elementId, item) {
    console.log(`Initializing detail map for item: ${item.title}`);
    
    // Create detail map centered on item
    detailMap = L.map(elementId).setView([item.location.lat, item.location.lng], 15);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(detailMap);
    
    // Add marker for this item
    L.marker([item.location.lat, item.location.lng], {
        icon: createCustomMarkerIcon(item)
    }).addTo(detailMap);
    
    return detailMap;
}

/**
 * Refresh the map (useful when container is resized or hidden/shown)
 */
function refreshMap() {
    if (map) {
        map.invalidateSize();
    }
}

/**
 * Center map on specific coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} zoom - Zoom level
 */
function centerMap(lat, lng, zoom = 15) {
    if (map) {
        map.setView([lat, lng], zoom);
    }
}

/**
 * Show a specific marker and open its popup
 * @param {number} itemId - Item ID to show
 */
function showMarker(itemId) {
    const marker = markers.find((m, index) => {
        return m._popup.getContent().includes(`data-id="${itemId}"`);
    });
    
    if (marker) {
        // Center map on marker
        map.setView(marker.getLatLng(), 15);
        
        // Open popup
        marker.openPopup();
    }
}

/**
 * Clean up map resources (useful when component is unmounted)
 */
function cleanupMap() {
    if (map) {
        map.remove();
        map = null;
    }
    
    if (detailMap) {
        detailMap.remove();
        detailMap = null;
    }
    
    markers = [];
}

// Export all map functions
export {
    initMap,
    renderMapMarkers,
    initDetailMap,
    refreshMap,
    centerMap,
    showMarker,
    cleanupMap
};