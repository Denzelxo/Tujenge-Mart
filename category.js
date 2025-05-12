// Sample product data (in a real application, this would come from a backend)
const products = {
    'traditional-crafts': [
        {
            id: 1,
            name: 'Wooden Carving',
            price: 2500,
            image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1',
            description: 'Hand-carved wooden sculpture',
            date: '2024-01-15'
        },
        // Add more products...
    ],
    'coffee-tea': [
        {
            id: 5,
            name: 'Kenyan Coffee Beans',
            price: 1200,
            image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1',
            description: 'Premium Arabica coffee beans',
            date: '2024-02-01'
        },
        // Add more products...
    ],
    // Add more categories...
};

// Show category products
function showCategoryProducts(category) {
    const categorySection = document.getElementById('categoryProducts');
    const categoryTitle = document.getElementById('categoryTitle');
    const productGrid = document.getElementById('categoryProductGrid');
    
    // Show loading spinner
    showSpinner();
    
    // Update category title
    categoryTitle.textContent = category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    // Get products for the category
    const categoryProducts = products[category] || [];
    
    // Render products
    productGrid.innerHTML = categoryProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">KES ${product.price.toLocaleString()}</p>
            <p class="description">${product.description}</p>
            <button class="add-to-cart" onclick="addToCart(${JSON.stringify(product)})">
                Add to Cart
            </button>
        </div>
    `).join('');
    
    // Show category section
    categorySection.style.display = 'block';
    
    // Hide spinner
    hideSpinner();
    
    // Scroll to category section
    categorySection.scrollIntoView({ behavior: 'smooth' });
}

// Filter products
function filterProducts(filter) {
    const productGrid = document.getElementById('categoryProductGrid');
    const products = Array.from(productGrid.children);
    
    // Update active filter button
    document.querySelectorAll('.filter-button').forEach(button => {
        button.classList.remove('active');
        if (button.dataset.filter === filter) {
            button.classList.add('active');
        }
    });
    
    // Sort products based on filter
    products.sort((a, b) => {
        const priceA = parseInt(a.querySelector('.price').textContent.replace(/[^0-9]/g, ''));
        const priceB = parseInt(b.querySelector('.price').textContent.replace(/[^0-9]/g, ''));
        
        switch (filter) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'newest':
                return new Date(b.dataset.date) - new Date(a.dataset.date);
            default:
                return 0;
        }
    });
    
    // Reorder products in the grid
    products.forEach(product => productGrid.appendChild(product));
}

// Form validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        const formGroup = input.parentElement;
        formGroup.classList.remove('error');
        
        if (!input.value.trim()) {
            formGroup.classList.add('error');
            formGroup.querySelector('.error-message').textContent = 'This field is required';
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            formGroup.classList.add('error');
            formGroup.querySelector('.error-message').textContent = 'Please enter a valid email';
            isValid = false;
        }
    });
    
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Toast notification
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Loading spinner
function showSpinner() {
    document.getElementById('spinner').classList.add('show');
}

function hideSpinner() {
    document.getElementById('spinner').classList.remove('show');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Filter button click handlers
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', () => {
            filterProducts(button.dataset.filter);
        });
    });
    
    // Form submission handlers
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(form)) {
                // Handle form submission
                showToast('Form submitted successfully!');
            }
        });
    });
    
    // Input validation on blur
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', () => {
            const formGroup = input.parentElement;
            if (input.required && !input.value.trim()) {
                formGroup.classList.add('error');
                formGroup.querySelector('.error-message').textContent = 'This field is required';
            } else {
                formGroup.classList.remove('error');
            }
        });
    });
}); 