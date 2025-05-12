// Theme Toggle
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle i');
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeToggle.classList.remove('fa-sun');
        themeToggle.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    }
}

// Check for saved theme preference
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.querySelector('.theme-toggle i').classList.replace('fa-moon', 'fa-sun');
    }
});

// Cart Management
let cart = [];

function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.toggle('active');
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    updateCartCount();
    saveCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    updateCartCount();
    saveCart();
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">KES ${item.price.toLocaleString()}</p>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" class="remove-item">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `KES ${total.toLocaleString()}`;
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartUI();
        updateCartCount();
        saveCart();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
        updateCartCount();
    }
}

// Login System
function toggleLogin() {
    const loginModal = document.getElementById('loginModal');
    loginModal.classList.toggle('active');
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Here you would typically make an API call to your backend
    // For demo purposes, we'll use a simple check
    if (email && password) {
        localStorage.setItem('user', JSON.stringify({ email }));
        toggleLogin();
        updateUserUI();
    }
}

function updateUserUI() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.querySelector('.user-icon').innerHTML = `
            <i class="fas fa-user"></i>
            <span class="user-email">${user.email}</span>
        `;
    }
}

// AI Assistant
const chatbotAssistant = {
    async processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Product search
        if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
            const searchTerm = message.split('search')[1] || message.split('find')[1];
            return `I'll help you find ${searchTerm}. Here are some relevant products:`;
        }
        
        // Price check
        if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            return 'Our prices are competitive and vary by product. Would you like to browse our catalog?';
        }
        
        // Payment methods
        if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
            return 'We accept M-Pesa and card payments (Visa, Mastercard). You can choose your preferred method at checkout.';
        }
        
        // Shipping
        if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
            return 'We offer nationwide shipping within 2-3 business days. Shipping costs vary by location.';
        }
        
        // Default response
        return "I'm here to help! You can ask me about products, prices, payment methods, or shipping. How can I assist you?";
    },
    
    startListening() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            
            recognition.onresult = (event) => {
                const message = event.results[0][0].transcript;
                document.getElementById('chatbotInput').value = message;
                sendMessage();
            };
            
            recognition.start();
        } else {
            addMessage('bot', 'Sorry, voice input is not supported in your browser.');
        }
    },
    
    toggleLanguage() {
        // Implement language switching logic here
        addMessage('bot', 'Language switching feature coming soon!');
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateUserUI();
}); 