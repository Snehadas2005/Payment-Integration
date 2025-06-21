# Stripe Payments Integration Module

A clean, responsive payment integration demo built for AmsterdamLore.com that simulates Stripe checkout functionality.

## 🚀 Features

- **Stripe Test Checkout**: $2.00 USD payment simulation
- **Responsive Design**: Mobile-friendly interface with gradient background
- **Route Handling**: SPA routing for `/payments` and home pages
- **Mock API**: Simulated backend endpoints for testing
- **Loading States**: Visual feedback during payment processing
- **Success/Error Handling**: Clear status messages for payment outcomes

## 📁 Project Structure

```
├── index.html          # Main HTML structure
├── script.js           # JavaScript functionality & mock API
├── style.css           # Responsive CSS styling
└── README.md           # This file
```

## 🛠️ API Endpoints

### POST `/api/create-checkout-session`
Creates a Stripe checkout session for payment processing.

**Request:**
```json
{
  "amount": 200,
  "currency": "usd"
}
```

**Response:**
```json
{
  "sessionId": "test_session_123"
}
```

### POST `/api/stripe-webhook`
Handles Stripe webhook simulation for payment completion.

**Request:**
```json
{
  "sessionId": "test_session_123",
  "success": true
}
```

**Response:**
```json
{
  "success": true
}
```

## 🎯 Routes

- `/` - Home page with product showcase
- `/payments` - Payment processing page
- `/success` - Payment success redirect
- `/error` - Payment failure redirect

## 💻 Usage

1. **Start Payment**: Click "Proceed to Checkout" button
2. **Simulation**: Confirm payment success/failure in browser prompt
3. **Feedback**: View success/error messages with auto-hide after 5 seconds

## 🎨 Design Features

- **Modern UI**: Glass-morphism navigation with gradient backgrounds
- **Smooth Animations**: Fade-in transitions and hover effects
- **Loading States**: Full-screen overlay with spinner
- **Status Messages**: Toast-style notifications for user feedback

## 📱 Responsive Design

- Mobile-optimized layout
- Flexible navigation (stacked on mobile)
- Responsive typography and spacing
- Touch-friendly button sizes

## 🔧 Technical Implementation

- **Vanilla JavaScript**: No external dependencies
- **Mock Server**: Built-in API simulation
- **Browser History**: Proper URL routing with pushState
- **Error Handling**: Comprehensive try-catch blocks
- **State Management**: Centralized AppState object

## 🌐 Deployment

Ready for deployment on any static hosting platform:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## 📧 Contact

For questions regarding this module, contact: **careers@alatreeventures.com**

---

*Built for AmsterdamLore.com - Showcasing Amsterdam's hidden stories through innovative web*
