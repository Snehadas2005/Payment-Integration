// script.js

const AppState = {
    currentPage: 'home',
    isLoading: false,
    sessionId: null
};

function showPage(pageName) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const targetNavLink = document.querySelector(`[data-page="${pageName}"]`);
    if (targetNavLink) {
        targetNavLink.classList.add('active');
    }

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    AppState.currentPage = pageName;
    const newPath = pageName === 'home' ? '/' : `/${pageName}`;
    
    if (window.history && window.history.pushState) {
        try {
            window.history.pushState({ page: pageName }, '', newPath);
        } catch (e) {
            console.warn('Unable to update browser history:', e);
        }
    }
}

async function createCheckoutSession() {
    if (AppState.isLoading) return null;

    setLoadingState(true);
    hideStatusMessages();

    try {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: 200,
                currency: 'usd'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create checkout session');
        }

        const data = await response.json();
        AppState.sessionId = data.sessionId;

        setTimeout(() => {
            simulateStripeCheckout(data.sessionId);
        }, 1000);

        return data;

    } catch (error) {
        console.error('Error creating checkout session:', error);
        setLoadingState(false);
        showErrorMessage('Failed to create checkout session. Please try again.');
        throw error;
    }
}

function simulateStripeCheckout(sessionId) {
    setLoadingState(false);
    
    if (confirm(`🎭 SIMULATION MODE\n\nIn production, you would be redirected to:\nhttps://checkout.stripe.com/pay/${sessionId}\n\nFor this demo, simulate payment success?`)) {
        simulateWebhook(true);
    } else {
        simulateWebhook(false);
    }
}

async function simulateWebhook(success) {
    try {
        const response = await fetch('/api/stripe-webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId: AppState.sessionId,
                success: success
            })
        });

        const data = await response.json();

        if (data.success) {
            showSuccessMessage();
        } else {
            showErrorMessage('Payment failed. Please try again.');
        }

    } catch (error) {
        console.error('Webhook error:', error);
        showErrorMessage('Payment processing failed. Please try again.');
    }
}

function setLoadingState(isLoading) {
    AppState.isLoading = isLoading;
    const loadingEl = document.getElementById('loading');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (isLoading) {
        if (loadingEl) loadingEl.style.display = 'flex';
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
            checkoutBtn.textContent = 'Processing...';
        }
    } else {
        if (loadingEl) loadingEl.style.display = 'none';
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = '🛒 Proceed to Checkout';
        }
    }
}

function showSuccessMessage() {
    hideStatusMessages();
    const successEl = document.getElementById('successMessage');
    if (successEl) {
        successEl.style.display = 'block';
        
        setTimeout(() => {
            successEl.style.display = 'none';
        }, 5000);
    }
}

function showErrorMessage(message) {
    hideStatusMessages();
    const errorEl = document.getElementById('errorMessage');
    if (errorEl) {
        errorEl.textContent = `❌ ${message}`;
        errorEl.style.display = 'block';
        
        setTimeout(() => {
            errorEl.style.display = 'none';
        }, 5000);
    }
}

function hideStatusMessages() {
    const successEl = document.getElementById('successMessage');
    const errorEl = document.getElementById('errorMessage');
    if (successEl) successEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';
}

class MockAPIServer {
    constructor() {
        this.setupMockEndpoints();
    }

    setupMockEndpoints() {
        const originalFetch = window.fetch;
        window.fetch = async (url, options = {}) => {
            
            if (url === '/api/create-checkout-session' && options.method === 'POST') {
                await this.delay(800);
                return new Response(JSON.stringify({
                    sessionId: `test_session_${Date.now()}`
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            if (url === '/api/stripe-webhook' && options.method === 'POST') {
                await this.delay(500);
                const body = JSON.parse(options.body);
                return new Response(JSON.stringify({
                    success: body.success
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            return originalFetch(url, options);
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const mockServer = new MockAPIServer();

function initializeRouter() {
    const path = window.location.pathname;
    
    switch (path) {
        case '/payments':
            showPage('payments');
            break;
        case '/success':
            showSuccessMessage();
            showPage('home'); 
            break;
        case '/error':
            showErrorMessage('Payment failed.');
            showPage('home');
            break;
        default:
            showPage('home');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Payment Integration Demo Loaded');
    console.log('📁 Project Structure:');
    console.log('├── index.html');
    console.log('├── /api/create-checkout-session (POST endpoint)');
    console.log('├── /api/stripe-webhook (POST endpoint)');
    console.log('└── /payments (Payment page route)');
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const pageName = e.target.getAttribute('data-page');
            if (pageName) showPage(pageName);
        });
    });
    
    initializeRouter();
    
    if (window.history && window.history.replaceState) {
        try {
            window.history.replaceState({ page: AppState.currentPage }, '', window.location.pathname);
        } catch (e) {
            console.warn('Unable to set initial history state:', e);
        }
    }
});

window.addEventListener('popstate', (e) => {
    const path = window.location.pathname;
    if (path === '/payments') {
        showPage('payments');
    } else {
        showPage('home');
    }
});

console.log('Stripe Payments Integration Demo');
console.log('Available routes:');
console.log('- / (home)');
console.log('- /payments');
console.log('- /success');
console.log('- /error');