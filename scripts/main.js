/**
 * Main Application Entry Point
 * Orchestrates initialization of all modules
 */

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI effects (typing, particles, navbar, mobile menu)
    initUIEffects();
    
    // Initialize portfolio (cards & modal)
    initPortfolio();
    
    // Initialize Coffee Clicker Game
    initCoffeeGame();
});
