// Cart and checkout system
class CartManager {
    constructor() {
        this.cart = [];
        this.total = 0;
    }

    // Add item to cart
    addToCart(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity
            });
        }
        
        this.updateTotal();
        this.saveCart();
    }

    // Remove item from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateTotal();
        this.saveCart();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.updateTotal();
            this.saveCart();
        }
    }

    // Update total
    updateTotal() {
        this.total = this.cart.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0
        );
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateTotal();
        }
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.total = 0;
        this.saveCart();
    }
}

// Payment system
class PaymentManager {
    constructor() {
        this.cartManager = new CartManager();
    }

    // Initialize M-Pesa payment
    async initiateMpesaPayment(phoneNumber) {
        try {
            // In a real app, this would call the M-Pesa API
            const response = await this.simulateMpesaAPI({
                phoneNumber,
                amount: this.cartManager.total,
                callbackUrl: 'https://kenyamart.com/api/mpesa/callback'
            });
            
            return response;
        } catch (error) {
            console.error('M-Pesa payment failed:', error);
            throw error;
        }
    }

    // Process card payment
    async processCardPayment(cardDetails) {
        try {
            // In a real app, this would integrate with a payment gateway
            const response = await this.simulateCardPayment({
                cardNumber: cardDetails.cardNumber,
                expiryDate: cardDetails.expiryDate,
                cvv: cardDetails.cvv,
                amount: this.cartManager.total
            });
            
            return response;
        } catch (error) {
            console.error('Card payment failed:', error);
            throw error;
        }
    }

    // Simulate M-Pesa API call
    async simulateMpesaAPI(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: `MPESA${Date.now()}`,
                    message: 'Please check your phone to complete the payment'
                });
            }, 1000);
        });
    }

    // Simulate card payment
    async simulateCardPayment(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: `CARD${Date.now()}`,
                    message: 'Payment successful'
                });
            }, 1000);
        });
    }
}

// Order management
class OrderManager {
    constructor() {
        this.cartManager = new CartManager();
        this.paymentManager = new PaymentManager();
    }

    // Create new order
    async createOrder(paymentMethod, paymentDetails) {
        try {
            const user = authManager.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            let paymentResponse;
            if (paymentMethod === 'mpesa') {
                paymentResponse = await this.paymentManager.initiateMpesaPayment(paymentDetails.phoneNumber);
            } else if (paymentMethod === 'card') {
                paymentResponse = await this.paymentManager.processCardPayment(paymentDetails);
            }

            const order = {
                id: Date.now(),
                userId: user.id,
                items: this.cartManager.cart,
                total: this.cartManager.total,
                status: 'pending',
                paymentMethod,
                paymentDetails: paymentResponse,
                createdAt: new Date().toISOString()
            };

            // Store order
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));

            // Clear cart after successful order
            this.cartManager.clearCart();

            return order;
        } catch (error) {
            console.error('Failed to create order:', error);
            throw error;
        }
    }

    // Get user orders
    async getUserOrders(userId) {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            return orders.filter(order => order.userId === userId);
        } catch (error) {
            console.error('Failed to get user orders:', error);
            throw error;
        }
    }

    // Update order status
    async updateOrderStatus(orderId, status) {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const orderIndex = orders.findIndex(o => o.id === orderId);
            
            if (orderIndex !== -1) {
                orders[orderIndex].status = status;
                localStorage.setItem('orders', JSON.stringify(orders));
                return orders[orderIndex];
            }
            throw new Error('Order not found');
        } catch (error) {
            console.error('Failed to update order status:', error);
            throw error;
        }
    }
}

// Initialize managers
const cartManager = new CartManager();
const paymentManager = new PaymentManager();
const orderManager = new OrderManager();

// Export for use in other files
window.cartManager = cartManager;
window.paymentManager = paymentManager;
window.orderManager = orderManager; 