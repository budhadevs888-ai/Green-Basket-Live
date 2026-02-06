# Green Basket - Customer Panel

A clean, simple, and trust-building grocery delivery application built with React, TypeScript, and Tailwind CSS.

## 🎯 Design Philosophy

- **Simple**: Easy to understand and use
- **Fast**: Quick navigation and interactions
- **Trust-building**: Clean UI with no complexity exposed
- Customer never sees sellers, stock numbers, or system logic

## 📱 Screens

### 1. Login Screen (`/`)
- Phone number + OTP authentication
- No password required
- Clean, friendly entry point

### 2. Location Setup (`/location-setup`)
- **Mandatory gate** - customers cannot browse without setting location
- GPS-based location detection
- Manual address entry with verification

### 3. Home Screen (`/home`)
- Browse products by category
- Search functionality
- Add to cart with quantity controls
- No seller visibility
- No stock counts shown

### 4. Cart Screen (`/cart`)
- Review cart items
- Update quantities or remove items
- View bill summary
- Free delivery above ₹500
- Cash on Delivery only

### 5. Order Confirmation (`/order-confirm`)
- Final review before placing order
- Delivery address confirmation
- Payment summary
- COD confirmation

### 6. Order Tracking (`/order-tracking/:orderId`)
- Real-time order status timeline
- Estimated delivery time
- Order items summary
- No seller/delivery partner info shown

### 7. Order History (`/orders`)
- List of all past orders
- Order status badges
- Quick access to order details

### 8. Profile Screen (`/profile`)
- Phone number display
- Edit delivery address
- Logout option

## 🔐 Security & Access Control

- **JWT-based authentication** (simulated)
- Protected routes - no access without login
- Location gate - cannot browse without setting delivery location
- Direct URL access blocked for unauthorized users
- Persistent authentication via localStorage

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS v4** for styling
- **Shadcn UI** components
- **Lucide Icons**
- **Context API** for state management
- **LocalStorage** for persistence
- **Date-fns** for date formatting
- **Sonner** for toast notifications

## 📦 Features

### Cart Management
- Add/remove items
- Update quantities
- Real-time total calculation
- Automatic delivery fee calculation

### Order Management
- Place orders
- Track order status
- View order history
- Order details

### User Management
- Phone authentication
- Profile management
- Address management
- Persistent sessions

## 🎨 UI/UX Highlights

- **Responsive design** - works on all screen sizes
- **Bottom navigation** - easy mobile navigation
- **Empty states** - friendly messages for empty cart/orders
- **Loading states** - clear feedback during async operations
- **Error handling** - toast notifications for errors
- **Quantity controls** - intuitive +/- buttons
- **Status badges** - color-coded order statuses

## 🚀 Getting Started

1. The app starts at the login screen
2. Use phone number: `1234567890`
3. Enter OTP: `123456` (hint provided)
4. Set delivery location (use "Use Current Location" button)
5. Start browsing and adding items to cart

## 💡 Demo Credentials

- **Phone**: Any 10-digit number
- **OTP**: `123456`

## 📝 Notes

- All product images are from Unsplash
- Mock data is used for products and orders
- State persists across page refreshes
- No backend required - fully functional frontend demo
- Free delivery on orders above ₹500
