// data.js - Data management and manipulation

// Local copy of cultural data for processing
let culturalData = [];

/**
 * Initialize data module with cultural data
 * @param {Array} data - Array of cultural items
 */
function initData(data) {
    console.log(`Initializing data module with ${data.length} cultural items`);
    culturalData = [...data];
}

/**
 * Filter data based on selected criteria
 * @param {Array} data - Original data array
 * @param {Array} categories - Selected categories
 * @param {Array} periods - Selected time periods
 * @param {Array} districts - Selected districts
 * @returns {Array} - Filtered data array
 */
function filterData(data, categories, periods, districts) {
    let filteredData = [...data];
    
    // Apply category filters
    if (categories.length > 0) {
        filteredData = filteredData.filter(item => categories.includes(item.category));
    }
    
    // Apply period filters
    if (periods.length > 0) {
        filteredData = filteredData.filter(item => periods.includes(item.period));
    }
    
    // Apply district filters
    if (districts.length > 0) {
        filteredData = filteredData.filter(item => districts.includes(item.district));
    }
    
    console.log(`Applied filters - results: ${filteredData.length} items`);
    return filteredData;
}

/**
 * Get data for items in a thematic collection
 * @param {Object} theme - Thematic collection
 * @returns {Array} - Array of cultural items in the theme
 */
function getThemeData(theme) {
    return culturalData.filter(item => theme.items.includes(item.id));
}

/**
 * Get data for saved items
 * @param {Array} savedItemIds - Array of saved item IDs
 * @returns {Array} - Array of saved cultural items
 */
function getSavedItemsData(savedItemIds) {
    return culturalData.filter(item => savedItemIds.includes(item.id));
}

/**
 * Get a single item by ID
 * @param {number} itemId - Item ID
 * @returns {Object|null} - Cultural item or null if not found
 */
function getItemById(itemId) {
    return culturalData.find(item => item.id === itemId) || null;
}

/**
 * Get all unique categories from data
 * @returns {Array} - Array of unique categories
 */
function getAllCategories() {
    const categories = new Set(culturalData.map(item => item.category));
    return Array.from(categories);
}

/**
 * Get all unique time periods from data
 * @returns {Array} - Array of unique time periods
 */
function getAllPeriods() {
    const periods = new Set(culturalData.map(item => item.period));
    return Array.from(periods);
}

/**
 * Get all unique districts from data
 * @returns {Array} - Array of unique districts
 */
function getAllDistricts() {
    const districts = new Set(culturalData.map(item => item.district));
    return Array.from(districts);
}

/**
 * Search items by query string
 * @param {string} query - Search query
 * @returns {Array} - Array of matching items
 */
function searchItems(query) {
    if (!query || query.trim() === '') {
        return [];
    }
    
    const searchTerms = query.toLowerCase().trim().split(/\s+/);
    
    return culturalData.filter(item => {
        // Search in title
        const titleMatch = searchTerms.some(term => 
            item.title.toLowerCase().includes(term)
        );
        
        // Search in description
        const descriptionMatch = searchTerms.some(term => 
            item.description.toLowerCase().includes(term)
        );
        
        // Search in tags
        const tagsMatch = item.tags && item.tags.some(tag => 
            searchTerms.some(term => tag.toLowerCase().includes(term))
        );
        
        // Search in category
        const categoryMatch = searchTerms.some(term => 
            item.category.toLowerCase().includes(term)
        );
        
        return titleMatch || descriptionMatch || tagsMatch || categoryMatch;
    });
}

/**
 * Get items related to a specific item
 * @param {Object} item - Cultural item
 * @param {number} limit - Maximum number of related items to return
 * @returns {Array} - Array of related items
 */
function getRelatedItems(item, limit = 3) {
    // First, try to find items in the same category
    let related = culturalData.filter(other => 
        other.id !== item.id && other.category === item.category
    );
    
    // If we don't have enough, try to find items in the same district
    if (related.length < limit) {
        const sameDistrict = culturalData.filter(other => 
            other.id !== item.id && 
            other.district === item.district && 
            other.category !== item.category
        );
        
        // Add items without duplicates
        for (const district of sameDistrict) {
            if (!related.some(r => r.id === district.id)) {
                related.push(district);
                if (related.length >= limit) break;
            }
        }
    }
    
    // If we still don't have enough, try to find items with matching tags
    if (related.length < limit && item.tags && item.tags.length > 0) {
        const itemTags = new Set(item.tags.map(tag => tag.toLowerCase()));
        
        const withMatchingTags = culturalData.filter(other => {
            if (other.id === item.id || related.some(r => r.id === other.id)) {
                return false;
            }
            
            return other.tags && other.tags.some(tag => 
                itemTags.has(tag.toLowerCase())
            );
        });
        
        // Add items without duplicates
        for (const tagMatch of withMatchingTags) {
            related.push(tagMatch);
            if (related.length >= limit) break;
        }
    }
    
    // If we still don't have enough, just add random items
    const remaining = limit - related.length;
    if (remaining > 0) {
        const otherItems = culturalData.filter(other => 
            other.id !== item.id && !related.some(r => r.id === other.id)
        );
        
        // Shuffle array to get random items
        const shuffled = otherItems.sort(() => 0.5 - Math.random());
        
        // Add random items
        for (let i = 0; i < Math.min(remaining, shuffled.length); i++) {
            related.push(shuffled[i]);
        }
    }
    
    return related.slice(0, limit);
}

/**
 * Format item data for export (e.g., CSV, JSON)
 * @param {Array} items - Array of items to format
 * @param {string} format - Output format ('json' or 'csv')
 * @returns {string} - Formatted data
 */
function formatItemsForExport(items, format = 'json') {
    if (format === 'json') {
        return JSON.stringify(items, null, 2);
    } else if (format === 'csv') {
        // Get all possible keys from all items
        const allKeys = new Set();
        items.forEach(item => {
            Object.keys(item).forEach(key => {
                // Skip complex objects like location and arrays like images
                if (typeof item[key] !== 'object' && !Array.isArray(item[key])) {
                    allKeys.add(key);
                }
            });
        });
        
        const headers = Array.from(allKeys);
        
        // Create CSV header row
        let csv = headers.join(',') + '\n';
        
        // Add data rows
        items.forEach(item => {
            const row = headers.map(header => {
                const value = item[header] || '';
                // Wrap in quotes and escape existing quotes
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csv += row.join(',') + '\n';
        });
        
        return csv;
    }
    
    throw new Error(`Unsupported export format: ${format}`);
}

// Export all data functions
export {
    initData,
    filterData,
    getThemeData,
    getSavedItemsData,
    getItemById,
    getAllCategories,
    getAllPeriods,
    getAllDistricts,
    searchItems,
    getRelatedItems,
    formatItemsForExport
};