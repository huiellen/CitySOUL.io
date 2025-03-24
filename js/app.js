// app.js - Application initialization and coordination

// Import modules
import { CULTURAL_DATA, THEMATIC_COLLECTIONS } from '../data/cultural-data.js';
import * as MapModule from './map.js';
import * as UIModule from './ui.js';
import * as ViewsModule from './views.js';
import * as DataModule from './data.js';

// Application state
const AppState = {
    currentView: 'map',
    selectedItem: null,
    isLoggedIn: false,
    savedItems: [],
    filteredData: [],
    activeFilters: {
        categories: [],
        periods: [],
        districts: []
    }
};

/**
 * Initialize the application
 */
function initApp() {
    console.log('Initializing CitySOUL application...');
    
    // Load saved items from localStorage
    loadSavedItemsFromStorage();
    
    // Check login status
    checkLoginStatus();
    
    // Initialize data
    DataModule.initData(CULTURAL_DATA);
    AppState.filteredData = [...CULTURAL_DATA];
    
    // Set up UI event listeners
    setupEventListeners();
    
    // Initialize map
    MapModule.initMap('mapid');
    
    // Render initial map markers
    MapModule.renderMapMarkers(AppState.filteredData, handleMarkerClick);
    
    // Initialize views
    ViewsModule.initViews();
    
    // Render thematic collections
    ViewsModule.renderThematicCollections(THEMATIC_COLLECTIONS, handleThemeSelect);
    
    // Update saved items count
    UIModule.updateSavedItemsCount(AppState.savedItems.length);
    
    // Render saved items view
    ViewsModule.renderSavedItems(
        DataModule.getSavedItemsData(AppState.savedItems),
        handleItemView,
        toggleSaveItem,
        handleExploreMap
    );
    UIModule.updateResultsCount(AppState.filteredData.length);
    console.log('CitySOUL application initialized successfully');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('map-nav-btn').addEventListener('click', () => setView('map'));
    document.getElementById('themes-nav-btn').addEventListener('click', () => setView('themes'));
    document.getElementById('saved-nav-btn').addEventListener('click', () => {
        if (AppState.isLoggedIn) {
            setView('saved');
        } else {
            UIModule.toggleLoginModal(true);
        }
    });
    document.getElementById('social-service-btn').addEventListener('click', () => setView('social-service'));
    document.getElementById('add-memory-btn').addEventListener('click', () => {
        if (AppState.isLoggedIn) {
            // Show add memory form (to be implemented)
            alert('Add memory feature coming soon!');
        } else {
            UIModule.toggleLoginModal(true);
        }
    });
    
    // Mobile navigation
    document.getElementById('mobile-menu-btn').addEventListener('click', UIModule.toggleMobileMenu);
    document.getElementById('mobile-map-btn').addEventListener('click', () => {
        setView('map');
        UIModule.toggleMobileMenu(false);
    });
    document.getElementById('mobile-themes-btn').addEventListener('click', () => {
        setView('themes');
        UIModule.toggleMobileMenu(false);
    });
    document.getElementById('mobile-saved-btn').addEventListener('click', () => {
        if (AppState.isLoggedIn) {
            setView('saved');
            UIModule.toggleMobileMenu(false);
        } else {
            UIModule.toggleLoginModal(true);
        }
    });
    document.getElementById('mobile-social-btn').addEventListener('click', () => {
        setView('social-service');
        UIModule.toggleMobileMenu(false);
    });
    document.getElementById('mobile-add-memory-btn').addEventListener('click', () => {
        if (AppState.isLoggedIn) {
            // Show add memory form (to be implemented)
            alert('Add memory feature coming soon!');
            UIModule.toggleMobileMenu(false);
        } else {
            UIModule.toggleLoginModal(true);
        }
    });
    
    // Login modal
    document.getElementById('login-btn').addEventListener('click', () => UIModule.toggleLoginModal(true));
    document.getElementById('close-modal-btn').addEventListener('click', () => UIModule.toggleLoginModal(false));
    document.getElementById('login-submit-btn').addEventListener('click', handleLogin);
    
    // Filters
    document.getElementById('clear-filters-btn').addEventListener('click', clearAllFilters);
    document.getElementById('show-filters-btn').addEventListener('click', () => UIModule.toggleFilterPanel(true));
    document.getElementById('close-filters-btn').addEventListener('click', () => UIModule.toggleFilterPanel(false));
    document.getElementById('filters-overlay').addEventListener('click', () => UIModule.toggleFilterPanel(false));
    
    // Set up filter change listeners
    setupFilterListeners('.category-filters input', 'categories');
    setupFilterListeners('.period-filters input', 'periods');
    setupFilterListeners('.district-filters input', 'districts');
}

/**
 * Set up filter listeners for a specific type
 * @param {string} selector - CSS selector for filter inputs
 * @param {string} filterType - Type of filter (categories, periods, districts)
 */
function setupFilterListeners(selector, filterType) {
    const filterElements = document.querySelectorAll(selector);
    filterElements.forEach(element => {
        element.addEventListener('change', () => {
            if (element.checked) {
                AppState.activeFilters[filterType].push(element.value);
            } else {
                AppState.activeFilters[filterType] = AppState.activeFilters[filterType]
                    .filter(value => value !== element.value);
            }
            applyFilters();
        });
    });
}

/**
 * Load saved items from localStorage
 */
function loadSavedItemsFromStorage() {
    const storedItems = localStorage.getItem('citysoul-saved-items');
    if (storedItems) {
        AppState.savedItems = JSON.parse(storedItems);
    }
}

/**
 * Check if user was previously logged in
 */
function checkLoginStatus() {
    const loggedInStatus = localStorage.getItem('citysoul-logged-in');
    if (loggedInStatus === 'true') {
        AppState.isLoggedIn = true;
        UIModule.updateLoginButton(true);
    }
}

/**
 * Set the current view
 * @param {string} view - View name ('map', 'details', 'themes', 'saved', 'social-service')
 */
function setView(view) {
    AppState.currentView = view;
    ViewsModule.setView(view);
    
    // Special handling for map view
    if (view === 'map') {
        // Force map to recalculate size when it becomes visible
        setTimeout(() => {
            MapModule.refreshMap();
        }, 100);
    }
}

/**
 * Apply current filters to data
 */
function applyFilters() {
    AppState.filteredData = DataModule.filterData(
        CULTURAL_DATA,
        AppState.activeFilters.categories,
        AppState.activeFilters.periods,
        AppState.activeFilters.districts
    );
    
    // Update UI with filtered data
    MapModule.renderMapMarkers(AppState.filteredData, handleMarkerClick);
    UIModule.updateResultsCount(AppState.filteredData.length);
    
    // On mobile, close the filter panel after applying filters
    if (window.innerWidth < 768) {
        UIModule.toggleFilterPanel(false);
    }
}

/**
 * Clear all active filters
 */
function clearAllFilters() {
    AppState.activeFilters = {
        categories: [],
        periods: [],
        districts: []
    };
    
    // Uncheck all filter checkboxes
    document.querySelectorAll('.category-filters input, .period-filters input, .district-filters input')
        .forEach(checkbox => {
            checkbox.checked = false;
        });
    
    applyFilters();
}

/**
 * Handle marker click event
 * @param {Object} item - Cultural item data
 */
function handleMarkerClick(item) {
    AppState.selectedItem = item;
    ViewsModule.renderItemDetails(
        item,
        AppState.savedItems.includes(item.id),
        AppState.isLoggedIn,
        handleBackToMap,
        toggleSaveItem
    );
    setView('details');
}

/**
 * Handle thematic collection selection
 * @param {Object} theme - Thematic collection
 */
function handleThemeSelect(theme) {
    // Find the first item in the theme
    const firstItem = CULTURAL_DATA.find(item => theme.items.includes(item.id));
    if (firstItem) {
        handleMarkerClick(firstItem);
    }
}

/**
 * Handle back to map button click
 */
function handleBackToMap() {
    setView('map');
}

/**
 * Handle item view button click
 * @param {Object} item - Cultural item data
 */
function handleItemView(item) {
    handleMarkerClick(item);
}

/**
 * Handle explore map button click
 */
function handleExploreMap() {
    setView('map');
}

/**
 * Toggle save/unsave item
 * @param {number} itemId - Item ID
 */
function toggleSaveItem(itemId) {
    if (!AppState.isLoggedIn) {
        UIModule.toggleLoginModal(true);
        return;
    }
    
    if (AppState.savedItems.includes(itemId)) {
        AppState.savedItems = AppState.savedItems.filter(id => id !== itemId);
    } else {
        AppState.savedItems.push(itemId);
    }
    
    // Save to localStorage
    localStorage.setItem('citysoul-saved-items', JSON.stringify(AppState.savedItems));
    
    // Update UI
    UIModule.updateSavedItemsCount(AppState.savedItems.length);
    
    // If in details view, update the save button
    if (AppState.currentView === 'details' && AppState.selectedItem && AppState.selectedItem.id === itemId) {
        ViewsModule.updateSaveButton(AppState.savedItems.includes(itemId));
    }
    
    // If in saved view, re-render saved items
    if (AppState.currentView === 'saved') {
        ViewsModule.renderSavedItems(
            DataModule.getSavedItemsData(AppState.savedItems),
            handleItemView,
            toggleSaveItem,
            handleExploreMap
        );
    }
}

/**
 * Handle login submission
 */
function handleLogin() {
    AppState.isLoggedIn = true;
    localStorage.setItem('citysoul-logged-in', 'true');
    UIModule.toggleLoginModal(false);
    UIModule.updateLoginButton(true);
    
    // If trying to access saved items, show the saved view
    if (AppState.currentView === 'map') {
        setView('saved');
    }
}

// Initialize the application when the page loads
window.addEventListener('DOMContentLoaded', initApp);

// Export public methods
export {
    AppState,
    setView,
    toggleSaveItem,
    applyFilters,
    clearAllFilters
};