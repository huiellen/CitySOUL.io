// ui.js - UI interactions and management

/**
 * Toggle mobile menu visibility
 * @param {boolean|undefined} show - Force show/hide, or toggle if undefined
 */
function toggleMobileMenu(show) {
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (show === undefined) {
        mobileMenu.classList.toggle('hidden');
    } else if (show) {
        mobileMenu.classList.remove('hidden');
    } else {
        mobileMenu.classList.add('hidden');
    }
}

/**
 * Toggle login modal visibility
 * @param {boolean} show - Show or hide the modal
 */
function toggleLoginModal(show) {
    const loginModal = document.getElementById('login-modal');
    
    if (show) {
        loginModal.classList.remove('hidden');
    } else {
        loginModal.classList.add('hidden');
    }
}

/**
 * Toggle filter panel visibility (mobile)
 * @param {boolean} show - Show or hide the panel
 */
function toggleFilterPanel(show) {
    const filtersPanel = document.getElementById('filters-panel');
    const filtersOverlay = document.getElementById('filters-overlay');
    
    if (show) {
        filtersPanel.classList.add('active');
        filtersOverlay.classList.add('active');
    } else {
        filtersPanel.classList.remove('active');
        filtersOverlay.classList.remove('active');
    }
}

/**
 * Update the login button based on login status
 * @param {boolean} isLoggedIn - Current login status
 */
function updateLoginButton(isLoggedIn) {
    const loginBtn = document.getElementById('login-btn');
    if (isLoggedIn) {
        loginBtn.innerHTML = '<i class="fas fa-user mr-1"></i> My Account';
    } else {
        loginBtn.innerHTML = '<i class="fas fa-user mr-1"></i> Log In';
    }
}

/**
 * Update the results count display
 * @param {number} count - Number of results
 */
function updateResultsCount(count) {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = count;
    }
}

/**
 * Update the saved items count display
 * @param {number} count - Number of saved items
 */
function updateSavedItemsCount(count) {
    const savedCountElements = document.querySelectorAll('#saved-count, .mobile-saved-count');
    savedCountElements.forEach(element => {
        element.textContent = count;
    });
}

/**
 * Show a notification message
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success', 'error', 'info')
 * @param {number} duration - Duration in milliseconds
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Check if notification container exists, create if not
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed bottom-4 right-4 z-50 flex flex-col space-y-2';
        document.body.appendChild(container);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    
    // Set appropriate color based on type
    let bgColor, textColor, icon;
    switch (type) {
        case 'success':
            bgColor = 'bg-green-500';
            textColor = 'text-white';
            icon = '<i class="fas fa-check-circle mr-2"></i>';
            break;
        case 'error':
            bgColor = 'bg-red-500';
            textColor = 'text-white';
            icon = '<i class="fas fa-exclamation-circle mr-2"></i>';
            break;
        case 'info':
        default:
            bgColor = 'bg-blue-500';
            textColor = 'text-white';
            icon = '<i class="fas fa-info-circle mr-2"></i>';
            break;
    }
    
    // Set notification content
    notification.className = `${bgColor} ${textColor} px-4 py-3 rounded-lg shadow-lg flex items-center transform transition-all duration-300 ease-in-out`;
    notification.innerHTML = `
        ${icon}
        <span>${message}</span>
        <button class="ml-4 focus:outline-none" aria-label="Close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification to container
    container.appendChild(notification);
    
    // Add animation effect
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    });
    
    // Handle close button click
    const closeButton = notification.querySelector('button');
    closeButton.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto close after duration
    setTimeout(() => {
        closeNotification(notification);
    }, duration);
}

/**
 * Close a notification with animation
 * @param {HTMLElement} notification - Notification element to close
 */
function closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    
    // Remove from DOM after animation completes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300); // Match the duration in the CSS transition
}

/**
 * Show confirmation dialog
 * @param {string} message - Confirmation message
 * @param {Function} onConfirm - Callback for confirm action
 * @param {Function} onCancel - Callback for cancel action
 */
function showConfirmDialog(message, onConfirm, onCancel) {
    // Create the modal container
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    // Create the modal content
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 class="text-xl font-bold mb-4">Confirm Action</h2>
            <p class="mb-6">${message}</p>
            <div class="flex justify-end space-x-3">
                <button id="cancel-btn" class="px-4 py-2 border rounded-lg hover:bg-gray-100">
                    Cancel
                </button>
                <button id="confirm-btn" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Confirm
                </button>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Handle confirm button click
    const confirmBtn = modal.querySelector('#confirm-btn');
    confirmBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        if (onConfirm) onConfirm();
    });
    
    // Handle cancel button click
    const cancelBtn = modal.querySelector('#cancel-btn');
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        if (onCancel) onCancel();
    });
    
    // Handle backdrop click (cancel)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            if (onCancel) onCancel();
        }
    });
}

/**
 * Initialize audio player functionality
 * @param {HTMLElement} container - Container element for the audio player
 * @param {Function} onPlay - Callback when audio starts playing
 * @param {Function} onPause - Callback when audio is paused
 * @param {Function} onEnded - Callback when audio playback completes
 */
function initAudioPlayer(container, onPlay, onPause, onEnded) {
    if (!container) return;
    
    const audioPlayBtn = container.querySelector('.audio-play-btn');
    const audioProgress = container.querySelector('.audio-progress');
    const audioTime = container.querySelector('.audio-time');
    
    let audioPlaying = false;
    let audioInterval = null;
    
    // Clear any existing intervals first
    if (audioInterval) {
        clearInterval(audioInterval);
        audioInterval = null;
    }
    
    if (audioPlayBtn) {
        audioPlayBtn.addEventListener('click', () => {
            audioPlaying = !audioPlaying;
            
            if (audioPlaying) {
                audioPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
                
                // Call the play callback
                if (onPlay) onPlay();
                
                // Simulate audio progress
                let progress = 0;
                audioInterval = setInterval(() => {
                    progress += 1;
                    if (progress > 100) {
                        clearInterval(audioInterval);
                        audioInterval = null;
                        audioPlaying = false;
                        audioPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                        if (audioProgress) audioProgress.style.width = '0%';
                        if (audioTime) audioTime.textContent = '00:00 / 03:45';
                        
                        // Call the ended callback
                        if (onEnded) onEnded();
                        return;
                    }
                    
                    if (audioProgress) audioProgress.style.width = `${progress}%`;
                    
                    // Update time display
                    if (audioTime) {
                        const currentSeconds = Math.floor((progress / 100) * 225); // 3:45 = 225 seconds
                        const currentMinutes = Math.floor(currentSeconds / 60);
                        const currentRemainingSeconds = currentSeconds % 60;
                        
                        audioTime.textContent = `${String(currentMinutes).padStart(2, '0')}:${String(currentRemainingSeconds).padStart(2, '0')} / 03:45`;
                    }
                }, 100);
            } else {
                audioPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                
                // Clear the interval
                if (audioInterval) {
                    clearInterval(audioInterval);
                    audioInterval = null;
                }
                
                // Call the pause callback
                if (onPause) onPause();
            }
        });
    }
    
    // Return a cleanup function
    return function cleanup() {
        if (audioInterval) {
            clearInterval(audioInterval);
            audioInterval = null;
        }
    };
}

/**
 * Format content to be display-safe
 * @param {string} content - Content to format
 * @returns {string} - Formatted content
 */
function formatContent(content) {
    if (!content) return '';
    
    // Convert URLs to links
    content = content.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" class="text-indigo-600 hover:underline">$1</a>'
    );
    
    // Add line breaks
    content = content.replace(/\n/g, '<br>');
    
    return content;
}

/**
 * Handle image loading errors
 * @param {HTMLImageElement} img - Image element
 */
function handleImageError(img) {
    img.onerror = () => {
        img.src = 'images/placeholder.jpg';
        img.alt = 'Image not available';
    };
}

/**
 * Create a loading indicator
 * @param {string} containerId - ID of container to add loader to
 * @param {string} message - Optional loading message
 * @returns {Function} - Function to remove the loader
 */
function showLoader(containerId, message = 'Loading...') {
    const container = document.getElementById(containerId);
    if (!container) return () => {};
    
    // Create loader element
    const loader = document.createElement('div');
    loader.className = 'flex flex-col items-center justify-center p-8';
    loader.innerHTML = `
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
        <p class="mt-4 text-gray-600">${message}</p>
    `;
    
    // Add loader to container
    container.appendChild(loader);
    
    // Return function to remove loader
    return function hideLoader() {
        if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }
    };
}

// Export UI functions
export {
    toggleMobileMenu,
    toggleLoginModal,
    toggleFilterPanel,
    updateLoginButton,
    updateResultsCount,
    updateSavedItemsCount,
    showNotification,
    showConfirmDialog,
    initAudioPlayer,
    formatContent,
    handleImageError,
    showLoader
};