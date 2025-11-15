// Global Error Handler for AION
// Prevents external library errors from breaking the app

(function() {
    'use strict';
    
    // Track loaded dependencies
    const dependencies = {
        pyth: false,
        lucide: false,
        tailwind: false,
        lineraConfig: false,
        api: false
    };
    
    // Global error handler
    window.addEventListener('error', function(e) {
        const msg = e.message || '';
        
        // Handle Pyth Network errors
        if (msg.includes('pyth') || msg.includes('Pyth')) {
            console.warn('⚠️ Pyth Network SDK issue (non-critical):', msg);
            e.preventDefault();
            return;
        }
        
        // Handle CDN loading errors
        if (msg.includes('cdn') || msg.includes('CDN')) {
            console.warn('⚠️ CDN loading issue (non-critical):', msg);
            e.preventDefault();
            return;
        }
        
        // Handle AI/ML model errors
        if (msg.includes('model') || msg.includes('Model') || msg.includes('AI')) {
            console.warn('⚠️ Model loading issue (non-critical):', msg);
            e.preventDefault();
            return;
        }
        
        // Log other errors but don't break
        console.error('Error caught:', msg);
    }, true);
    
    // Check dependencies on load
    window.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            console.log('🔍 Checking AION dependencies...');
            
            // Check Pyth
            if (typeof pyth !== 'undefined' || typeof window.pyth !== 'undefined') {
                dependencies.pyth = true;
                console.log('✅ Pyth Network SDK loaded');
            } else {
                console.warn('⚠️ Pyth Network SDK not loaded (using fallback)');
                // Create fallback
                window.pyth = {
                    getPriceUnsafe: function() {
                        return {
                            price: '50000',
                            conf: '100',
                            expo: -8,
                            publishTime: Date.now()
                        };
                    }
                };
            }
            
            // Check Lucide
            if (typeof lucide !== 'undefined') {
                dependencies.lucide = true;
                console.log('✅ Lucide icons loaded');
            } else {
                console.warn('⚠️ Lucide icons not loaded');
            }
            
            // Check Tailwind
            if (typeof tailwind !== 'undefined' || document.querySelector('script[src*="tailwind"]')) {
                dependencies.tailwind = true;
                console.log('✅ Tailwind CSS loaded');
            }
            
            // Check Linera Config
            if (typeof LINERA_CONFIG !== 'undefined') {
                dependencies.lineraConfig = true;
                console.log('✅ Linera configuration loaded');
            } else {
                console.warn('⚠️ Linera configuration not loaded');
            }
            
            // Check API
            if (typeof API_BASE_URL !== 'undefined' || typeof window.API_BASE_URL !== 'undefined') {
                dependencies.api = true;
                console.log('✅ API configuration loaded');
            }
            
            // Summary
            const loaded = Object.values(dependencies).filter(Boolean).length;
            const total = Object.keys(dependencies).length;
            console.log(`📊 Dependencies: ${loaded}/${total} loaded`);
            
            if (loaded === total) {
                console.log('🎉 All dependencies loaded successfully!');
            } else {
                console.log('⚠️ Some dependencies missing, using fallbacks');
            }
        }, 1000);
    });
    
    // Provide fallback for missing functions
    window.safeCall = function(fn, fallback) {
        try {
            return fn();
        } catch (e) {
            console.warn('Function call failed, using fallback:', e.message);
            return fallback;
        }
    };
    
    console.log('🛡️ Error handler initialized');
})();
