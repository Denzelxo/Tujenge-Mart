// Product categories
const PRODUCT_CATEGORIES = {
    ELECTRONICS: 'electronics',
    FASHION: 'fashion',
    AGRO_PRODUCTS: 'agro-products',
    HANDICRAFTS: 'handicrafts',
    COFFEE_TEA: 'coffee-tea',
    BEAUTY: 'beauty',
    HOME_LIVING: 'home-living'
};

// Product management system
class ProductManager {
    constructor() {
        this.products = [];
        this.categories = PRODUCT_CATEGORIES;
        this.recommendations = [];
    }

    // Add new product
    async addProduct(productData) {
        try {
            const product = {
                id: Date.now(),
                ...productData,
                createdAt: new Date().toISOString(),
                sellerId: authManager.getCurrentUser()?.id
            };
            
            // Store in localStorage for demo
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            products.push(product);
            localStorage.setItem('products', JSON.stringify(products));
            
            return product;
        } catch (error) {
            console.error('Failed to add product:', error);
            throw error;
        }
    }

    // Get products by category
    async getProductsByCategory(category) {
        try {
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            return products.filter(p => p.category === category);
        } catch (error) {
            console.error('Failed to get products:', error);
            throw error;
        }
    }

    // Get seller products
    async getSellerProducts(sellerId) {
        try {
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            return products.filter(p => p.sellerId === sellerId);
        } catch (error) {
            console.error('Failed to get seller products:', error);
            throw error;
        }
    }

    // Generate recommendations using TensorFlow.js
    async generateRecommendations(userId) {
        try {
            // In a real app, this would use TensorFlow.js for ML-based recommendations
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            const userOrders = JSON.parse(localStorage.getItem('orders') || '[]')
                .filter(o => o.userId === userId);
            
            // Simple recommendation based on user's order history
            const userCategories = userOrders.flatMap(o => 
                o.items.map(item => item.category)
            );
            
            const categoryCounts = userCategories.reduce((acc, category) => {
                acc[category] = (acc[category] || 0) + 1;
                return acc;
            }, {});
            
            const recommendedCategories = Object.entries(categoryCounts)
                .sort(([,a], [,b]) => b - a)
                .map(([category]) => category);
            
            this.recommendations = products.filter(p => 
                recommendedCategories.includes(p.category)
            );
            
            return this.recommendations;
        } catch (error) {
            console.error('Failed to generate recommendations:', error);
            throw error;
        }
    }
}

// Initialize product manager
const productManager = new ProductManager();

// Export for use in other files
window.productManager = productManager; 