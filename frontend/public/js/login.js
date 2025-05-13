// App State
const state = {
    currentScreen: 'login', // 'login', 'signup', 'dashboard'
    user: null,
    profileImage: null,
    galleryImages: []
};
// DOM Elements
const authScreens = document.getElementById('auth-screens');
const loginScreen = document.getElementById('login-screen');
const signupScreen = document.getElementById('signup-screen');
// const dashboard = document.getElementById('dashboard');
const showLoginBtn = document.getElementById('show-login');
const showSignupBtn = document.getElementById('show-signup');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Initialize App
function initApp() {
    showScreen('login');

    // Event Listeners
    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('login');
    });

    showSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('signup');
    });

    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);

}
// Show Screen
function showScreen(screen) {
    state.currentScreen = screen;

    loginScreen.classList.add('hidden');
    signupScreen.classList.add('hidden');
    authScreens.classList.remove('hidden');

    if (screen === 'login') {
        loginScreen.classList.remove('hidden');
    } else if (screen === 'signup') {
        signupScreen.classList.remove('hidden');
    } else if (screen === 'dashboard') {
        authScreens.classList.add('hidden');
    }
}
function renderHtmlFile(res, filePath) {
    const absolutePath = path.join(__dirname, filePath);
    res.sendFile(absolutePath, (err) => {
        if (err) {
            console.error(`Error rendering file: ${filePath}`, err);
            res.status(500).send('Internal Server Error');
        }
    });
}
// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:4000/auth-gateway/auth/login', {
            method: 'POST',
            credentials: 'include', // Include cookies in the request
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Login failed:', error);
            alert(error.error || 'Login failed');
            return;
        }

        const data = await response.json();
        console.log('Login successful:', data);

        window.location.href = "/chat"
    } catch (err) {
        console.error('Error during login:', err);
        alert('An error occurred while logging in. Please try again.');
    }
}
// Handle Signup
async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch('http://localhost:4000/auth-gateway/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password}),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Signup failed:', error);
            alert(error.error || 'Signup failed');
            return;
        }

        const data = await response.json();
        console.log('Signup successful:', data);

        // Automatically log in the user after signup
        alert('Signup successful! You can now log in.');
        showScreen('login');

    } catch (err) {
        console.error('Error during signup:', err);
        alert('An error occurred while signing up. Please try again.');
    }
}

function toggleMobileMenu() {
    const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !expanded);
    mobileMenu.classList.toggle('hidden');
}
// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
