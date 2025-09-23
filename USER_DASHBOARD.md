# User Dashboard Documentation

## Overview
This document describes the user dashboard functionality that has been implemented for regular customers of the Beanmart e-commerce platform. The user dashboard is separate from the admin panel and provides customers with tools to manage their account, orders, and preferences.

## Features

### 1. User Authentication
- Simplified login page at `/login`
- Session management using JWT tokens
- Automatic redirection based on user role:
  - Admins are redirected to admin panel
  - Regular users are redirected to user dashboard

### 2. Dashboard Overview
- Personalized welcome message
- Account summary with key metrics
- Quick links to important sections

### 3. Order Management
- View order history
- Track order status (pending, confirmed, shipped, delivered, cancelled)
- View order details including items and pricing

### 4. Profile Management
- Update personal information (name, email, phone)
- Profile picture management
- View account creation date

### 5. Address Management
- Add, edit, and delete shipping addresses
- Set default shipping address
- Manage multiple addresses with labels (Home, Office, etc.)

### 6. Payment Method Management
- Add, edit, and delete payment methods
- Set default payment method
- Manage credit cards, debit cards, and bank transfers

### 7. Navigation
- Uses global header with user-specific dropdown menu
- Dropdown menu includes quick access to:
  - My Orders
  - Profile
  - Addresses
  - Payment Methods
- Mobile-friendly dropdown menu in hamburger icon
- Desktop navigation with key icons
- Clear separation between user and admin areas

## Technical Implementation

### Routing Structure
```
/login               - User login page
/user                - User dashboard (default view)
/user/orders         - Order management
/user/profile        - Profile management
/user/addresses      - Address management
/user/payment-methods - Payment method management
```

### Components
1. **UserLayout** - Main layout wrapper without header (uses global header)
2. **UserLogin** - Authentication form for regular users at `/login`
3. **UserDashboard** - Main dashboard view
4. **UserOrders** - Order management interface
5. **UserProfile** - Profile editing interface
6. **UserAddresses** - Address management interface
7. **UserPaymentMethods** - Payment method management interface

### Routes Configuration
The user dashboard routes are configured in `App.tsx`:
```tsx
<Route path="/user" element={<UserLayout />}>
  <Route index element={<UserDashboard />} />
  <Route path="orders" element={<UserOrders />} />
  <Route path="profile" element={<UserProfile />} />
  <Route path="addresses" element={<UserAddresses />} />
  <Route path="payment-methods" element={<UserPaymentMethods />} />
</Route>
```

### API Integration
The user dashboard consumes the following API endpoints:
- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/auth/profile` - User profile information
- `PUT /api/v1/auth/profile` - Update user profile information
- `GET /api/v1/orders/my` - User's order history
- `GET /api/v1/user/addresses` - User's shipping addresses
- `POST /api/v1/user/addresses` - Create new shipping address
- `PUT /api/v1/user/addresses/{id}` - Update shipping address
- `DELETE /api/v1/user/addresses/{id}` - Delete shipping address
- `GET /api/v1/user/payment-methods` - User's payment methods
- `POST /api/v1/user/payment-methods` - Create new payment method
- `PUT /api/v1/user/payment-methods/{id}` - Update payment method
- `DELETE /api/v1/user/payment-methods/{id}` - Delete payment method

### Security
- Role-based access control ensures users can only access their own data
- JWT token validation for all protected routes
- Proper session management with logout functionality

## User Flow

1. **Login Process**
   - User navigates to `/login`
   - Enters email and password
   - System authenticates without `isAdmin` flag
   - If user is admin, they are notified and can access admin panel
   - Regular users are redirected to `/user`

2. **Dashboard Access**
   - Authenticated users can access their dashboard at `/user`
   - Users can navigate between sections using dropdown menu in the global header
   - Profile information is accessible through user menu in the global header

3. **Order Management**
   - Users can view their order history via "My Orders" in dropdown menu
   - Orders are displayed with status badges
   - Order details can be viewed (future enhancement)

4. **Profile Management**
   - Users can update their personal information via "Profile" in dropdown menu
   - Profile picture can be changed (future enhancement)
   - Account information is displayed

5. **Address Management**
   - Users can manage shipping addresses via "Addresses" in dropdown menu
   - Add new addresses with labels
   - Set default shipping address
   - Edit or delete existing addresses

6. **Payment Method Management**
   - Users can manage payment methods via "Payment Methods" in dropdown menu
   - Add new payment methods (credit cards, debit cards, bank transfers)
   - Set default payment method
   - Edit or delete existing payment methods

## Design Improvements
- Added user dropdown menu in global header for easy navigation
- Removed duplicate header - now uses only global header
- Simplified layout structure
- Added mobile-friendly dropdown menu accessible via hamburger icon in global header
- Desktop navigation uses icon buttons for quick access in global header
- Responsive design that works well on all device sizes

## Future Enhancements
- Wishlist functionality
- Product reviews and ratings
- Notification system
- Account security settings (password change, 2FA)