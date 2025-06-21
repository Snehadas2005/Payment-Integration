const AppState = {
    currentPage: 'home',
    isLoading: false,
    sessionId: null
};

function showPage(pageName) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageName).classList.add('active');

    AppState.currentPage = pageName;
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const pageName = e.target.getAttribute('data-page');
            showPage(pageName);
        });
    });
});

async function createCheckoutSession() {
    if (AppState.isLoading) return;

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

    } catch (error) {
        console.error('Error creating checkout session:', error);
        setLoadingState(false);
        showErrorMessage('Failed to create checkout session. Please try again.');
    }
}

function simulateStripeCheckout(sessionId) {
    setLoadingState(false);
    
    const shouldSucceed = Math.random() > 0.3;
    
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
        loadingEl.style.display = 'flex';
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Processing...';
    } else {
        loadingEl.style.display = 'none';
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = '🛒 Proceed to Checkout';
    }
}

function showSuccessMessage() {
    hideStatusMessages();
    document.getElementById('successMessage').style.display = 'block';
    
    setTimeout(() => {
        document.getElementById('successMessage').style.display = 'none';
    }, 5000);
}

function showErrorMessage(message) {
    hideStatusMessages();
    const errorEl = document.getElementById('errorMessage');  
    errorEl.textContent = `❌ ${message}`;
    errorEl.style.display = 'block';
    
    setTimeout(() => {
        errorEl.style.display = 'none';
    }, 5000);
}

function hideStatusMessages() {
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
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

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Payment Integration Demo Loaded');
    console.log('📁 Project Structure:');
    console.log('├── index.html (Main application)');
    console.log('├── /api/create-checkout-session (POST endpoint)');
    console.log('├── /api/stripe-webhook (POST endpoint)');
    console.log('└── /payments (Payment page route)');
    
    if (window.location.pathname === '/payments') {
        showPage('payments');
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

const originalShowPage = showPage;
showPage = function(pageName) {
    originalShowPage(pageName);
    
    const newPath = pageName === 'home' ? '/' : `/${pageName}`;
    window.history.pushState({ page: pageName }, '', newPath);
};

const paymentButtons = {
    newPayment: document.getElementById('new-payment-btn'),
    retryPayment: document.getElementById('retry-payment-btn')
};

const elements = {
    checkoutSpinner: document.getElementById('checkout-spinner'),
    paymentSpinner: document.getElementById('payment-spinner'),
    paymentMessage: document.getElementById('payment-message')
};

function showSection(sectionName) {
    Object.values(sections).forEach(section => {
        section.classList.remove('active');
    });
    sections[sectionName].classList.add('active');
    
    const newUrl = sectionName === 'home' ? '/' : `/${sectionName}`;
    window.history.pushState({ section: sectionName }, '', newUrl);
}

function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

async function createCheckoutSession() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
        sessionId: 'test_session_123'
    };
}

async function simulateStripeWebhook() {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const isSuccess = Math.random() > 0.3;
    
    return {
        success: isSuccess
    };
}

function handlePaymentsRoute() {
    showSection('payments');
    processPayment();
}

async function processPayment() {
    try {
        elements.paymentMessage.textContent = 'Creating checkout session...';
        
        const sessionData = await createCheckoutSession();
        
        elements.paymentMessage.textContent = 'Redirecting to Stripe...';
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        elements.paymentMessage.textContent = 'Processing payment...';
        
        const webhookResult = await simulateStripeWebhook();
        
        if (webhookResult.success) {
            showSection('success');
        } else {
            showSection('error');
        }
        
    } catch (error) {
        console.error('Payment processing error:', error);
        showSection('error');
    }
}

buttons.checkout.addEventListener('click', async () => {
    setLoadingState(buttons.checkout, true);
    
    try {
        const sessionData = await createCheckoutSession();
        
        handlePaymentsRoute();
        
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Failed to create checkout session. Please try again.');
    } finally {
        setLoadingState(buttons.checkout, false);
    }
});

buttons.back.addEventListener('click', () => {
    showSection('home');
});

buttons.newPayment.addEventListener('click', () => {
    showSection('home');
});

buttons.retryPayment.addEventListener('click', () => {
    showSection('home');
});

window.addEventListener('popstate', (event) => {
    const section = event.state?.section || 'home';
    showSection(section);
});

function initializeRouter() {
    const path = window.location.pathname;
    
    switch (path) {
        case '/payments':
            handlePaymentsRoute();
            break;
        case '/success':
            showSection('success');
            break;
        case '/error':
            showSection('error');
            break;
        default:
            showSection('home');
    }
}

async function apiCreateCheckoutSession() {
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
    
    return response.json();
}

async function apiStripeWebhook(sessionId) {
    const response = await fetch('/api/stripe-webhook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sessionId: sessionId
        })
    });
    
    return response.json();
}

document.addEventListener('DOMContentLoaded', () => {
    initializeRouter();
    
    window.history.replaceState({ section: 'home' }, '', window.location.pathname);
});

console.log('Stripe Payments Integration Demo');
console.log('Available routes:');
console.log('- / (home)');
console.log('- /payments');
console.log('- /success');
console.log('- /error');