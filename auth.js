// User roles and authentication
const USER_ROLES = {
    BUYER: 'buyer',
    SELLER: 'seller',
    ADMIN: 'admin'
};

// User session management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
    }

    // Register new user
    async register(userData) {
        try {
            // In a real app, this would make an API call
            const user = {
                id: Date.now(),
                ...userData,
                role: userData.role || USER_ROLES.BUYER,
                createdAt: new Date().toISOString()
            };
            
            // Store in localStorage for demo
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            
            return user;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }

    // Login user
    async login(email, password) {
        try {
            // In a real app, this would make an API call
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                this.currentUser = user;
                this.isAuthenticated = true;
                localStorage.setItem('currentUser', JSON.stringify(user));
                return user;
            }
            throw new Error('Invalid credentials');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    // Logout user
    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('currentUser');
    }

    // Get current user
    getCurrentUser() {
        if (!this.currentUser) {
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.isAuthenticated = !!this.currentUser;
        }
        return this.currentUser;
    }

    // Check if user has required role
    hasRole(requiredRole) {
        const user = this.getCurrentUser();
        return user && user.role === requiredRole;
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Export for use in other files
window.authManager = authManager; 