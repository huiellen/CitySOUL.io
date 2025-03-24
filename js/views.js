// views.js - View rendering and management

// Import modules if needed
import * as MapModule from './map.js';

// DOM Elements for views
const mapView = document.getElementById('map-view');
const detailsView = document.getElementById('details-view');
const themesView = document.getElementById('themes-view');
const savedView = document.getElementById('saved-view');
const socialServiceView = document.getElementById('social-service-view');
const detailContent = document.getElementById('detail-content');
const themesContainer = document.getElementById('themes-container');
const savedItemsContainer = document.getElementById('saved-items-container');

/**
 * Initialize view elements
 */
function initViews() {
    // Make sure all view elements are found
    if (!mapView || !detailsView || !themesView || !savedView || !socialServiceView) {
        console.error('One or more view elements not found');
    }
}

/**
 * Set the current view
 * @param {string} view - View name ('map', 'details', 'themes', 'saved', 'social-service')
 */
function setView(view) {
    console.log(`Setting view: ${view}`);
    
    // Hide all views
    mapView.classList.add('hidden');
    detailsView.classList.add('hidden');
    themesView.classList.add('hidden');
    savedView.classList.add('hidden');
    socialServiceView.classList.add('hidden');
    
    // Update navigation highlighting
    document.getElementById('map-nav-btn').classList.remove('font-bold');
    document.getElementById('themes-nav-btn').classList.remove('font-bold');
    document.getElementById('saved-nav-btn').classList.remove('font-bold');
    document.getElementById('social-service-btn').classList.remove('font-bold');
    
    // Show selected view and highlight nav
    switch(view) {
        case 'map':
            mapView.classList.remove('hidden');
            document.getElementById('map-nav-btn').classList.add('font-bold');
            break;
        case 'details':
            detailsView.classList.remove('hidden');
            break;
        case 'themes':
            themesView.classList.remove('hidden');
            document.getElementById('themes-nav-btn').classList.add('font-bold');
            break;
        case 'saved':
            savedView.classList.remove('hidden');
            document.getElementById('saved-nav-btn').classList.add('font-bold');
            break;
        case 'social-service':
            socialServiceView.classList.remove('hidden');
            document.getElementById('social-service-btn').classList.add('font-bold');
            break;
        default:
            console.error(`Unknown view: ${view}`);
            mapView.classList.remove('hidden');
    }
}

/**
 * Render item details
 * @param {Object} item - Cultural item data
 * @param {boolean} isSaved - Whether the item is saved by user
 * @param {boolean} isLoggedIn - Whether the user is logged in
 * @param {Function} backCallback - Callback for back button
 * @param {Function} saveCallback - Callback for save button
 * @param {Function} deleteCallback - Callback for delete button (only for user-added items)
 */
function renderItemDetails(item, isSaved, isLoggedIn, backCallback, saveCallback, deleteCallback) {
    if (!item || !detailContent) return;
    
    console.log(`Rendering details for item: ${item.title}`);
    
    const saveButtonClass = isSaved ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600';
    
    detailContent.innerHTML = `
        <!-- Navigation and actions -->
        <div class="flex flex-wrap justify-between items-center mb-6">
            <button class="flex items-center text-gray-600 hover:text-gray-900 mb-2 sm:mb-0" id="back-to-map-btn">
                ← Back
            </button>
            
            <div class="flex space-x-2">
                <button class="p-2 rounded-full ${saveButtonClass}" id="save-item-btn">
                    <i class="fas fa-bookmark"></i>
                </button>
                ${isLoggedIn ? `
                    <button class="p-2 rounded-full bg-gray-100 text-gray-600" id="download-item-btn">
                        <i class="fas fa-download"></i>
                    </button>
                ` : ''}
                ${item.contributor === "User Added" ? `
                    <button class="p-2 rounded-full bg-red-100 text-red-600" id="delete-item-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </div>
        </div>
        
        <!-- Title and metadata -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold mb-2">${item.title}</h1>
            <div class="flex flex-wrap gap-2 text-sm text-gray-500">
                <span class="bg-gray-100 px-2 py-1 rounded">${item.category}</span>
                <span class="bg-gray-100 px-2 py-1 rounded">${item.period}</span>
                <span class="bg-gray-100 px-2 py-1 rounded">${item.district}</span>
                <span class="bg-gray-100 px-2 py-1 rounded">Contributed by: ${item.contributor}</span>
                ${item.contributor === "User Added" ? `
                    <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded">User Created</span>
                ` : ''}
            </div>
        </div>
        
        <!-- Rest of the details view remains the same -->
        <!-- Image gallery -->
        <div class="mb-6">
            <div class="grid grid-cols-1 ${item.images.length > 1 ? 'md:grid-cols-2' : ''} gap-4">
                ${item.images.map((img, i) => `
                    <img 
                        src="${img}" 
                        alt="${item.title} - image ${i+1}" 
                        class="w-full h-56 object-cover rounded-lg"
                        onerror="this.src='images/placeholder.jpg';this.alt='Image not available';"
                    />
                `).join('')}
            </div>
        </div>
    `;
    
    // Add audio player if available
    if (item.audio) {
        detailContent.innerHTML += `
            <!-- Audio player -->
            <div class="mb-6">
                <h2 class="text-lg font-semibold mb-2">Audio Recording</h2>
                <div class="audio-player">
                    <button 
                        class="audio-play-btn"
                        id="audio-play-btn"
                    >
                        <i class="fas fa-play"></i>
                    </button>
                    <div class="ml-3 flex-1 audio-progress-container">
                        <div 
                            id="audio-progress"
                            class="audio-progress" 
                            style="width: 0%;"
                        ></div>
                    </div>
                    <div class="audio-time" id="audio-time">
                        00:00 / 03:45
                    </div>
                </div>
            </div>
        `;
    }
    
    // Add map showing location of the item
    detailContent.innerHTML += `
        <!-- Location map -->
        <div class="mb-6">
            <h2 class="text-lg font-semibold mb-2">Location</h2>
            <div id="detail-map" class="h-64 rounded-lg overflow-hidden shadow-sm"></div>
        </div>
    `;
    
    // Add description and tags
    detailContent.innerHTML += `
        <!-- Description -->
        <div class="mb-6">
            <h2 class="text-lg font-semibold mb-2">Description</h2>
            <p class="text-gray-700">
                ${item.description}
            </p>
        </div>
        
        <!-- Tags -->
        <div>
            <h2 class="text-lg font-semibold mb-2">Tags</h2>
            <div class="flex flex-wrap gap-2">
                ${(item.tags && item.tags.length > 0) ? item.tags.map(tag => `
                    <span class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                        #${tag}
                    </span>
                `).join('') : '<span class="text-gray-500">No tags</span>'}
            </div>
        </div>
    `;
    
    // Add event listeners for buttons
    document.getElementById('back-to-map-btn').addEventListener('click', backCallback);
    document.getElementById('save-item-btn').addEventListener('click', () => saveCallback(item.id));
    
    // Handle download button if logged in
    if (isLoggedIn) {
        const downloadBtn = document.getElementById('download-item-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                alert(`Download functionality for "${item.title}" will be implemented soon.`);
            });
        }
    }
    
    // Handle delete button for user-added items
    if (item.contributor === "User Added") {
        const deleteBtn = document.getElementById('delete-item-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete "${item.title}"? This cannot be undone.`)) {
                    deleteCallback(item.id);
                }
            });
        }
    }
    
    // Initialize detail map
    setTimeout(() => {
        MapModule.initDetailMap('detail-map', item);
    }, 100);
    
    // Initialize audio player if available
    if (item.audio) {
        const audioContainer = detailContent.querySelector('.audio-player');
        if (audioContainer) {
            // This should be a call to a UI module function
            // We'll just demonstrate here
            const audioPlayBtn = document.getElementById('audio-play-btn');
            const audioProgress = document.getElementById('audio-progress');
            const audioTime = document.getElementById('audio-time');
            
            let audioPlaying = false;
            
            audioPlayBtn.addEventListener('click', () => {
                audioPlaying = !audioPlaying;
                
                if (audioPlaying) {
                    audioPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    // Simulate audio progress
                    let progress = 0;
                    const audioInterval = setInterval(() => {
                        progress += 1;
                        if (progress > 100) {
                            clearInterval(audioInterval);
                            audioPlaying = false;
                            audioPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                            audioProgress.style.width = '0%';
                            audioTime.textContent = '00:00 / 03:45';
                            return;
                        }
                        
                        audioProgress.style.width = `${progress}%`;
                        
                        // Update time display
                        const currentSeconds = Math.floor((progress / 100) * 225); // 3:45 = 225 seconds
                        const currentMinutes = Math.floor(currentSeconds / 60);
                        const currentRemainingSeconds = currentSeconds % 60;
                        
                        audioTime.textContent = `${String(currentMinutes).padStart(2, '0')}:${String(currentRemainingSeconds).padStart(2, '0')} / 03:45`;
                    }, 100);
                } else {
                    audioPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                    // In a real app, would pause the audio here
                }
            });
        }
    }
}

/**
 * Update save button in item details
 * @param {boolean} isSaved - Whether the item is saved
 */
function updateSaveButton(isSaved) {
    const saveButton = document.getElementById('save-item-btn');
    if (saveButton) {
        if (isSaved) {
            saveButton.className = 'p-2 rounded-full bg-indigo-100 text-indigo-700';
        } else {
            saveButton.className = 'p-2 rounded-full bg-gray-100 text-gray-600';
        }
    }
}

/**
 * Render thematic collections
 * @param {Array} themes - Array of thematic collections
 * @param {Function} themeSelectCallback - Callback when a theme is selected
 */
function renderThematicCollections(themes, themeSelectCallback) {
    if (!themesContainer) return;
    
    console.log(`Rendering ${themes.length} thematic collections`);
    
    themesContainer.innerHTML = '';
    
    themes.forEach(theme => {
        const themeElement = document.createElement('div');
        themeElement.className = 'card';
        themeElement.innerHTML = `
            <img src="${theme.image}" alt="${theme.title}" class="card-img">
            <div class="card-body">
                <h2 class="card-title">${theme.title}</h2>
                <p class="text-gray-600 mb-4">${theme.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-gray-500">${theme.items.length} items</span>
                    <button class="btn btn-primary btn-rounded">
                        Explore
                    </button>
                </div>
            </div>
        `;
        
        // Add click event to the Explore button
        const exploreButton = themeElement.querySelector('button');
        exploreButton.addEventListener('click', () => {
            themeSelectCallback(theme);
        });
        
        themesContainer.appendChild(themeElement);
    });
}

/**
 * Render saved items
 * @param {Array} savedData - Array of saved items data
 * @param {Function} viewItemCallback - Callback when an item is viewed
 * @param {Function} removeItemCallback - Callback when an item is removed
 * @param {Function} exploreMapCallback - Callback when explore map is clicked
 */
function renderSavedItems(savedData, viewItemCallback, removeItemCallback, exploreMapCallback) {
    if (!savedItemsContainer) return;
    
    console.log(`Rendering ${savedData.length} saved items`);
    
    if (savedData.length === 0) {
        savedItemsContainer.innerHTML = `
            <div class="text-center py-12 bg-gray-50 rounded-xl">
                <i class="fas fa-bookmark text-gray-400 text-4xl mb-4"></i>
                <h2 class="text-xl font-medium mb-2">No saved items yet</h2>
                <p class="text-gray-500 mb-4">Explore the map and save cultural memories to your collection.</p>
                <button class="btn btn-primary btn-rounded">
                    Explore Map
                </button>
            </div>
        `;
        
        // Add click event to the Explore Map button
        const exploreButton = savedItemsContainer.querySelector('button');
        exploreButton.addEventListener('click', exploreMapCallback);
        
    } else {
        savedItemsContainer.innerHTML = `
            <div class="flex flex-wrap justify-between items-center mb-4">
                <span class="text-gray-600 mb-2 sm:mb-0">${savedData.length} items saved</span>
                <div class="flex space-x-3">
                    <button class="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-200 transition">
                        Export Collection
                    </button>
                    <button id="clear-custom-memories" class="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition">
                        Clear Custom Memories
                    </button>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="saved-grid"></div>
        `;
        
        const savedGrid = savedItemsContainer.querySelector('#saved-grid');
        
        savedData.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'card';
            itemElement.innerHTML = `
                <img src="${item.images[0]}" alt="${item.title}" class="w-full h-40 object-cover"
                     onerror="this.src='images/placeholder.jpg';this.alt='Image not available';">
                <div class="p-4">
                    <div class="flex justify-between">
                        <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            ${item.category}
                        </span>
                        <button class="text-gray-400 hover:text-red-500 remove-saved-btn" data-id="${item.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <h3 class="text-lg font-medium mt-2 mb-1">${item.title}</h3>
                    <p class="text-gray-500 text-sm mb-3 line-clamp-2">${item.description}</p>
                    <div class="flex justify-between items-center">
                        <button class="text-indigo-600 hover:text-indigo-800 text-sm font-medium view-details-btn" data-id="${item.id}">
                            View Details →
                        </button>
                        ${item.contributor === "User Added" ? `
                            <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                User Added
                            </span>
                        ` : ''}
                    </div>
                </div>
            `;
            
            savedGrid.appendChild(itemElement);
        });
        
        // Add event listeners for buttons
        savedGrid.querySelectorAll('.remove-saved-btn').forEach(button => {
            button.addEventListener('click', () => {
                const itemId = parseInt(button.getAttribute('data-id'));
                removeItemCallback(itemId);
            });
        });
        
        savedGrid.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', () => {
                const itemId = parseInt(button.getAttribute('data-id'));
                const item = savedData.find(item => item.id === itemId);
                if (item) {
                    viewItemCallback(item);
                }
            });
        });
        
        // Add event listener for export button
        const exportButton = savedItemsContainer.querySelector('button:not(#clear-custom-memories):not(.view-details-btn):not(.remove-saved-btn)');
        if (exportButton) {
            exportButton.addEventListener('click', () => {
                alert('Export functionality will be implemented soon.');
            });
        }
        
        // Add event listener for clear custom memories button
        const clearButton = document.getElementById('clear-custom-memories');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                if (confirm("Are you sure you want to delete ALL your custom memories? This cannot be undone!")) {
                    localStorage.removeItem('citysoul-custom-memories');
                    alert('All custom memories have been cleared. Refresh the page to see changes.');
                    location.reload();
                }
            });
        }
    }
}

/**
 * Render social service view content
 * @param {Array} opportunities - Array of volunteer opportunities
 * @param {Array} events - Array of community events
 */
function renderSocialServiceContent(opportunities, events) {
    // This would be implemented to dynamically render the social service content
    console.log('Social service content rendering would be implemented here');
}

/**
 * Render related items section in details view
 * @param {Array} relatedItems - Array of related items
 * @param {Function} itemSelectCallback - Callback when an item is selected
 */
function renderRelatedItems(relatedItems, itemSelectCallback) {
    if (!detailContent) return;
    
    // Create related items section if it doesn't exist
    let relatedSection = detailContent.querySelector('#related-items-section');
    if (!relatedSection) {
        relatedSection = document.createElement('div');
        relatedSection.id = 'related-items-section';
        relatedSection.className = 'mt-8';
        detailContent.appendChild(relatedSection);
    }
    
    relatedSection.innerHTML = `
        <h2 class="text-xl font-semibold mb-4">Related Cultural Memories</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="related-items-grid"></div>
    `;
    
    const relatedGrid = relatedSection.querySelector('#related-items-grid');
    
    relatedItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'card';
        itemElement.innerHTML = `
            <img src="${item.images[0]}" alt="${item.title}" class="w-full h-32 object-cover"
                 onerror="this.src='images/placeholder.jpg';this.alt='Image not available';">
            <div class="p-3">
                <h3 class="font-medium">${item.title}</h3>
                <div class="flex items-center justify-between mt-2">
                    <span class="text-xs bg-gray-100 px-2 py-1 rounded">${item.category}</span>
                    <button class="text-indigo-600 text-sm font-medium view-related-btn" data-id="${item.id}">
                        View →
                    </button>
                </div>
            </div>
        `;
        
        relatedGrid.appendChild(itemElement);
    });
    
    // Add event listeners for buttons
    relatedGrid.querySelectorAll('.view-related-btn').forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.getAttribute('data-id'));
            const item = relatedItems.find(item => item.id === itemId);
            if (item) {
                itemSelectCallback(item);
            }
        });
    });
}

/**
 * Show add memory form
 * @param {Function} submitCallback - Callback when form is submitted
 * @param {Function} cancelCallback - Callback when form is cancelled
 */
function showAddMemoryForm(submitCallback, cancelCallback) {
    // Create a modal with the form
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-90vh overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Add New Memory</h2>
                <button id="close-add-memory-btn" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-lg"></i>
                </button>
            </div>
            
            <form id="add-memory-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Title</label>
                    <input type="text" name="title" class="w-full p-2 border rounded-lg" required>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Category</label>
                        <select name="category" class="w-full p-2 border rounded-lg" required>
                            <option value="">Select Category</option>
                            <option value="Military">Military</option>
                            <option value="Indigenous">Indigenous</option>
                            <option value="Architecture">Architecture</option>
                            <option value="Maritime">Maritime</option>
                            <option value="Museum">Museum</option>
                            <option value="Natural">Natural</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-1">Time Period</label>
                        <select name="period" class="w-full p-2 border rounded-lg" required>
                            <option value="">Select Period</option>
                            <option value="Pre-1850">Pre-1850</option>
                            <option value="1850-1880">1850-1880</option>
                            <option value="1880-1900">1880-1900</option>
                            <option value="1890-1910">1890-1910</option>
                            <option value="1940-1960">1940-1960</option>
                            <option value="1990-2010">1990-2010</option>
                            <option value="2000-2020">2000-2020</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-1">District</label>
                        <select name="district" class="w-full p-2 border rounded-lg" required>
                            <option value="">Select District</option>
                            <option value="Esquimalt">Esquimalt</option>
                            <option value="Victoria">Victoria</option>
                            <option value="Victoria Harbour">Victoria Harbour</option>
                        </select>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium mb-1">Description</label>
                    <textarea name="description" rows="4" class="w-full p-2 border rounded-lg" required></textarea>
                </div>
                
                <div>
                    <label class="block text-sm font-medium mb-1">Location (click on the map)</label>
                    <div id="form-map" class="h-64 border rounded-lg"></div>
                    <input type="hidden" name="latitude" required>
                    <input type="hidden" name="longitude" required>
                </div>
                
                <div>
                    <label class="block text-sm font-medium mb-1">Images</label>
                    <input type="file" name="images" multiple accept="image/*" class="w-full p-2 border rounded-lg">
                </div>
                
                <div>
                    <label class="block text-sm font-medium mb-1">Tags (comma separated)</label>
                    <input type="text" name="tags" class="w-full p-2 border rounded-lg" placeholder="E.g., heritage, history, architecture">
                </div>
                
                <div class="pt-4 flex justify-end space-x-3">
                    <button type="button" id="cancel-add-memory-btn" class="px-4 py-2 border rounded-lg hover:bg-gray-100">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Submit Memory
                    </button>
                </div>
            </form>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Initialize the form map
    setTimeout(() => {
        const formMap = L.map('form-map').setView([48.430, -123.430], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(formMap);
        
        // Add marker when map is clicked
        let marker = null;
        formMap.on('click', function(e) {
            if (marker) {
                formMap.removeLayer(marker);
            }
            
            marker = L.marker(e.latlng).addTo(formMap);
            
            // Update hidden inputs
            document.querySelector('input[name="latitude"]').value = e.latlng.lat;
            document.querySelector('input[name="longitude"]').value = e.latlng.lng;
        });
        
        // Force map to recalculate size
        formMap.invalidateSize();
    }, 100);
    
    // Handle form submission
    const form = document.getElementById('add-memory-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Gather form data
        const formData = new FormData(form);
        const memoryData = {
            title: formData.get('title'),
            category: formData.get('category'),
            period: formData.get('period'),
            district: formData.get('district'),
            description: formData.get('description'),
            location: {
                lat: parseFloat(formData.get('latitude')),
                lng: parseFloat(formData.get('longitude'))
            },
            tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        };
        
        // Call the submit callback
        submitCallback(memoryData);
        
        // Remove the modal
        document.body.removeChild(modal);
    });
    
    // Handle cancel/close buttons
    document.getElementById('close-add-memory-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
        if (cancelCallback) cancelCallback();
    });
    
    document.getElementById('cancel-add-memory-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
        if (cancelCallback) cancelCallback();
    });
}

// Export view functions
export {
    initViews,
    setView,
    renderItemDetails,
    updateSaveButton,
    renderThematicCollections,
    renderSavedItems,
    renderSocialServiceContent,
    renderRelatedItems,
    showAddMemoryForm
};