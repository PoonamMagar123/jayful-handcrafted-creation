# JAYFUL Handcrafted Creation — Jewellery Website

## Included
- Premium responsive jewellery storefront
- Product search + category filter
- Full Add to Cart flow
- Quantity controls, remove item and cart total
- WhatsApp checkout
- Admin product manager
- Add / Edit / Delete products
- Product stock management
- Browser localStorage persistence
- Your supplied JAYFUL logo included as `assets/logo.png`

## Before publishing
Open `app.js` and change:
1. `ADMIN_PASSWORD`
2. `WHATSAPP_NUMBER`

## Important
This version is a professional front-end/demo store. Product data and admin changes are stored in the browser's localStorage, so they are not shared between devices and the admin password is not secure for a public production store.

For a real production website, connect the same design to:
- a backend/database (Firebase, Supabase, or ASP.NET Core + SQL Server)
- secure admin authentication
- image upload/storage
- Razorpay/Stripe payment gateway
- order database and order-status management
- custom domain + HTTPS

## Run
Simply open `index.html` in a browser, or deploy the folder to any static hosting service.
