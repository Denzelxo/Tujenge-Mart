// Sample product data
const products = [
    {
        id: 1,
        name: "Maasai Beaded Necklace",
        price: 2500,
        image: "craft2.jpg",
        category: "Traditional Crafts"
    },
    {
        id: 2,
        name: "Kenyan Coffee Beans",
        price: 1200,
        image: "coffee1.jpg",
        category: "Coffee & Tea"
    },
    {
        id: 3,
        name: "Metal Art Sculpture",
        price: 30000,
        image: "mw3.jpg",
        category: "Fashion"
    },
    {
        id: 4,
        name: "African Print Painting",
        price: 80000,
        image: "art4.jpg",
        category: "Art"
    }
];

// Cart functionality
let cart = [];

// DOM Elements
const productGrid = document.querySelector('.product-grid');
const cartCount = document.querySelector('.cart-count');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Display products
function displayProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">KES ${product.price.toLocaleString()}</p>
            <button onclick="addToCart(${product.id})" class="add-to-cart">Add to Cart</button>
        </div>
    `).join('');
}

// Add to cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        showNotification(`${product.name} added to cart!`);
    }
}

// Update cart count
function updateCartCount() {
    cartCount.textContent = cart.length;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Search functionality
const searchInput = document.querySelector('.search-icon');
searchInput.addEventListener('click', () => {
    const searchTerm = prompt('Enter product name:');
    if (searchTerm) {
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayFilteredProducts(filteredProducts);
    }
});

// Display filtered products
function displayFilteredProducts(filteredProducts) {
    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">KES ${product.price.toLocaleString()}</p>
            <button onclick="addToCart(${product.id})" class="add-to-cart">Add to Cart</button>
        </div>
    `).join('');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        animation: slideIn 0.5s ease-out;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .product-card {
        background: white;
        border-radius: 10px;
        padding: 1rem;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }

    .product-card:hover {
        transform: translateY(-5px);
    }

    .product-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 5px;
    }

    .product-card h3 {
        margin: 1rem 0;
    }

    .price {
        color: var(--primary-color);
        font-weight: bold;
        font-size: 1.2rem;
    }

    .add-to-cart {
        width: 100%;
        padding: 0.8rem;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .add-to-cart:hover {
        background-color: #ff5252;
    }
`;
document.head.appendChild(style); 