/**
 * User Manager - Simple User ID System
 * For demo/testing purposes (no wallet required)
 */

class UserManager {
    constructor() {
        this.storageKey = 'aion_user_id';
        this.userId = this.loadOrCreateUser();
    }
    
    /**
     * Load existing user or create new one
     */
    loadOrCreateUser() {
        // Try to load from localStorage
        let userId = localStorage.getItem(this.storageKey);
        
        if (!userId) {
            // Generate new user ID
            userId = this.generateUserId();
            localStorage.setItem(this.storageKey, userId);
            console.log('🆕 New user created:', userId);
        } else {
            console.log('👤 Existing user loaded:', userId);
        }
        
        return userId;
    }
    
    /**
     * Generate unique user ID
     */
    generateUserId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 9);
        return `user-${timestamp}-${random}`;
    }
    
    /**
     * Get current user ID
     */
    getUserId() {
        return this.userId;
    }
    
    /**
     * Get user display name (short version)
     */
    getDisplayName() {
        // Show only last 8 characters
        return this.userId.slice(-8);
    }
    
    /**
     * Reset user (create new ID)
     */
    resetUser() {
        const newUserId = this.generateUserId();
        localStorage.setItem(this.storageKey, newUserId);
        this.userId = newUserId;
        console.log('🔄 User reset:', newUserId);
        return newUserId;
    }
    
    /**
     * Set custom user ID (for testing)
     */
    setUserId(customId) {
        this.userId = customId;
        localStorage.setItem(this.storageKey, customId);
        console.log('✏️ User ID set:', customId);
    }
    
    /**
     * Clear user data
     */
    clearUser() {
        localStorage.removeItem(this.storageKey);
        this.userId = null;
        console.log('🗑️ User data cleared');
    }
}

// Global instance
const userManager = new UserManager();

// Display user info in console
console.log('👤 User Manager initialized');
console.log('   User ID:', userManager.getUserId());
console.log('   Display:', userManager.getDisplayName());

// Make available globally
window.userManager = userManager;
