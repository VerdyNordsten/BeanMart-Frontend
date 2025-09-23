# Beanmart E-Commerce Backend API - Product Requirements Document (PRD)

## 1. Introduction

### 1.1 Purpose
This document outlines the product requirements for the Beanmart E-Commerce Backend API, a modern e-commerce platform specifically designed for a coffee shop business. The system will provide a robust backend API to support product management, user authentication, order processing, and administrative functions.

### 1.2 Scope
The Beanmart E-Commerce Backend API will serve as the foundation for a coffee shop's online presence, enabling customers to browse products, place orders, and manage their accounts. It will also provide administrative tools for managing inventory, orders, and user accounts.

### 1.3 Definitions, Acronyms, and Abbreviations
- **API**: Application Programming Interface
- **JWT**: JSON Web Token
- **S3**: Amazon Simple Storage Service
- **UUID**: Universally Unique Identifier
- **SKU**: Stock Keeping Unit
- **IDR**: Indonesian Rupiah

### 1.4 References
- Database schema definition in `database.sql`
- API documentation in `API_DOCUMENTATION.html`
- Swagger/OpenAPI documentation available at `/api-docs`

### 1.5 Overview
This PRD is organized into the following sections:
- Overall Description
- Specific Requirements
- Database Design
- API Endpoints
- Non-Functional Requirements
- Future Enhancements

## 2. Overall Description

### 2.1 Product Perspective
The Beanmart E-Commerce Backend API is a standalone backend service that provides RESTful APIs for a coffee shop e-commerce platform. It handles all business logic, data storage, and authentication for the platform.

The system will interact with:
- Frontend applications (web, mobile)
- PostgreSQL database for data persistence
- S3-compatible storage for product images
- Authentication services (JWT)

### 2.2 Product Functions
The main functions of the system include:
1. User authentication and management
2. Product catalog management
3. Shopping cart functionality
4. Order processing
5. Administrative tools for product and order management

### 2.3 User Characteristics
The system will serve three types of users:
1. **Unauthenticated Users**: Can browse products and register
2. **Authenticated Users**: Can place orders, manage their profile and addresses
3. **Administrators**: Can manage all aspects of the system including products, categories, and orders

### 2.4 Constraints
- Must use PostgreSQL as the database
- Must use S3-compatible storage for images
- Must use JWT for authentication
- Must be developed using Express.js with TypeScript
- Must use raw PostgreSQL queries for database operations

### 2.5 Assumptions and Dependencies
- PostgreSQL database is available and configured
- S3-compatible storage service is available
- Node.js environment is properly set up
- Environment variables are correctly configured

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 Authentication System
- **FR-1**: Users must be able to register with email, password, and optional phone number
- **FR-2**: Users must be able to log in with email and password
- **FR-3**: Admins must be able to log in with email and password
- **FR-4**: System must provide JWT tokens upon successful authentication
- **FR-5**: System must validate JWT tokens for protected endpoints
- **FR-6**: Users must be able to retrieve their profile information
- **FR-7**: Passwords must be securely hashed using BCrypt

#### 3.1.2 User Management
- **FR-8**: Users must be able to manage their profile information (name, phone, etc.)
- **FR-9**: Users must be able to manage multiple shipping addresses
- **FR-10**: Users must be able to set a default shipping address

#### 3.1.3 Product Catalog
- **FR-11**: System must support product categories
- **FR-12**: Products must have detailed information including name, descriptions, pricing, and weight
- **FR-13**: Products must support multiple images with ordering
- **FR-14**: Products must support variants (e.g., different sizes, grinds)
- **FR-15**: Products must have stock management at the variant level
- **FR-16**: Products must be able to be marked as active/inactive
- **FR-17**: System must support search and filtering of products

#### 3.1.4 Shopping Cart
- **FR-18**: Users must be able to add products to a shopping cart
- **FR-19**: Users must be able to modify quantities in the shopping cart
- **FR-20**: Users must be able to remove items from the shopping cart
- **FR-21**: System must calculate totals based on product prices and quantities

#### 3.1.5 Order Management
- **FR-22**: Users must be able to place orders with selected products
- **FR-23**: System must generate unique order numbers
- **FR-24**: Orders must track status (pending, confirmed, shipped, delivered, cancelled)
- **FR-25**: Orders must store shipping and billing addresses
- **FR-26**: Orders must calculate and store total amounts
- **FR-27**: Users must be able to view their order history
- **FR-28**: Admins must be able to view all orders
- **FR-29**: Admins must be able to update order status

#### 3.1.6 Administrative Functions
- **FR-30**: Admins must be able to manage product categories
- **FR-31**: Admins must be able to create, update, and delete products
- **FR-32**: Admins must be able to manage product variants and stock levels
- **FR-33**: Admins must be able to manage user accounts
- **FR-34**: Admins must be able to activate/deactivate their own accounts

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance
- **NFR-1**: API response time should be under 500ms for 95% of requests
- **NFR-2**: System should support at least 1000 concurrent users

#### 3.2.2 Security
- **NFR-3**: All passwords must be securely hashed
- **NFR-4**: All API endpoints must validate inputs
- **NFR-5**: JWT tokens must expire after 24 hours
- **NFR-6**: All communication must be over HTTPS in production

#### 3.2.3 Reliability
- **NFR-7**: System uptime should be 99.5%
- **NFR-8**: Database backups should be performed daily

#### 3.2.4 Usability
- **NFR-9**: API should follow RESTful principles
- **NFR-10**: API should provide comprehensive error messages
- **NFR-11**: API should be well-documented with Swagger/OpenAPI

#### 3.2.5 Compatibility
- **NFR-12**: API should be compatible with modern web browsers
- **NFR-13**: API should be compatible with mobile applications

## 4. Database Design

### 4.1 Entities and Relationships

#### 4.1.1 Users
- **Table**: users
- **Fields**: id (UUID), email (TEXT), phone (TEXT), full_name (TEXT), password_hash (TEXT), created_at (TIMESTAMPTZ)
- **Relationships**: One-to-many with user_addresses and orders

#### 4.1.2 User Addresses
- **Table**: user_addresses
- **Fields**: id (UUID), user_id (UUID), label (TEXT), recipient_name (TEXT), phone (TEXT), address_line1 (TEXT), address_line2 (TEXT), city (TEXT), state (TEXT), postal_code (TEXT), country (CHAR(2)), is_default (BOOLEAN), created_at (TIMESTAMPTZ)
- **Relationships**: Many-to-one with users

#### 4.1.3 Admins
- **Table**: admins
- **Fields**: id (UUID), email (TEXT), full_name (TEXT), password_hash (TEXT), is_active (BOOLEAN), created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ)

#### 4.1.4 Categories
- **Table**: categories
- **Fields**: id (UUID), slug (TEXT), name (TEXT)
- **Relationships**: Many-to-many with products through product_categories

#### 4.1.5 Products
- **Table**: products
- **Fields**: id (UUID), slug (TEXT), name (TEXT), short_description (TEXT), long_description (TEXT), source_url (TEXT), base_price (NUMERIC), base_compare_at_price (NUMERIC), currency (CHAR(3)), is_active (BOOLEAN), sku (TEXT), weight_gram (INTEGER), created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ)
- **Relationships**: 
  - Many-to-many with categories through product_categories
  - One-to-many with product_images, product_option_types, and product_variants

#### 4.1.6 Product Categories
- **Table**: product_categories
- **Fields**: product_id (UUID), category_id (UUID)
- **Relationships**: Junction table between products and categories

#### 4.1.7 Product Images
- **Table**: product_images
- **Fields**: id (UUID), product_id (UUID), url (TEXT), position (INTEGER)
- **Relationships**: Many-to-one with products

#### 4.1.8 Product Option Types
- **Table**: product_option_types
- **Fields**: id (UUID), product_id (UUID), name (TEXT), position (INTEGER)
- **Relationships**: Many-to-one with products, one-to-many with product_options

#### 4.1.9 Product Options
- **Table**: product_options
- **Fields**: id (UUID), option_type_id (UUID), value (TEXT), position (INTEGER)
- **Relationships**: Many-to-one with product_option_types

#### 4.1.10 Product Variants
- **Table**: product_variants
- **Fields**: id (UUID), product_id (UUID), sku (TEXT), price (NUMERIC), compare_at_price (NUMERIC), stock (INTEGER), weight_gram (INTEGER), option1_value (TEXT), option2_value (TEXT), option3_value (TEXT), is_active (BOOLEAN), created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ)
- **Relationships**: Many-to-one with products, one-to-many with variant_images and order_items

#### 4.1.11 Variant Images
- **Table**: variant_images
- **Fields**: id (UUID), variant_id (UUID), url (TEXT), position (INTEGER)
- **Relationships**: Many-to-one with product_variants

#### 4.1.12 Orders
- **Table**: orders
- **Fields**: id (UUID), user_id (UUID), order_number (TEXT), status (TEXT), total_amount (NUMERIC), currency (CHAR(3)), shipping_address (JSONB), billing_address (JSONB), notes (TEXT), created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ)
- **Relationships**: Many-to-one with users, one-to-many with order_items

#### 4.1.13 Order Items
- **Table**: order_items
- **Fields**: id (UUID), order_id (UUID), product_variant_id (UUID), quantity (INTEGER), price_per_unit (NUMERIC), total_price (NUMERIC), created_at (TIMESTAMPTZ)
- **Relationships**: Many-to-one with orders and product_variants

## 5. API Endpoints

### 5.1 Authentication Endpoints
- **POST /api/v1/auth/register**: Register a new user
- **POST /api/v1/auth/login**: Login as user or admin
- **GET /api/v1/auth/profile**: Get current user/admin profile

### 5.2 User Endpoints
- **GET /api/v1/users**: Get all users (admin only)
- **GET /api/v1/users/{id}**: Get a user by ID (admin only)
- **PUT /api/v1/users/{id}**: Update a user (admin only)
- **DELETE /api/v1/users/{id}**: Delete a user (admin only)

### 5.3 User Address Endpoints
- **GET /api/v1/user-addresses**: Get current user's addresses
- **POST /api/v1/user-addresses**: Create a new address
- **PUT /api/v1/user-addresses/{id}**: Update an address
- **DELETE /api/v1/user-addresses/{id}**: Delete an address

### 5.4 Category Endpoints
- **GET /api/v1/categories**: Get all categories
- **POST /api/v1/categories**: Create a new category (admin only)
- **PUT /api/v1/categories/{id}**: Update a category (admin only)
- **DELETE /api/v1/categories/{id}**: Delete a category (admin only)

### 5.5 Product Endpoints
- **GET /api/v1/products**: Get all products
- **GET /api/v1/products/active**: Get active products
- **GET /api/v1/products/{id}**: Get a product by ID
- **GET /api/v1/products/slug/{slug}**: Get a product by slug
- **POST /api/v1/products**: Create a new product (admin only)
- **PUT /api/v1/products/{id}**: Update a product (admin only)
- **DELETE /api/v1/products/{id}**: Delete a product (admin only)
- **GET /api/v1/products/{id}/images**: Get all images for a product
- **GET /api/v1/products/{id}/variants**: Get all variants for a product
- **GET /api/v1/products/{id}/variants/active**: Get active variants for a product

### 5.6 Product Category Endpoints
- **POST /api/v1/product-categories**: Add a product to a category (admin only)
- **DELETE /api/v1/product-categories**: Remove a product from a category (admin only)

### 5.7 Product Image Endpoints
- **POST /api/v1/product-images**: Add an image to a product (admin only)
- **PUT /api/v1/product-images/{id}**: Update a product image (admin only)
- **DELETE /api/v1/product-images/{id}**: Delete a product image (admin only)

### 5.8 Product Option Type Endpoints
- **POST /api/v1/product-option-types**: Create a product option type (admin only)
- **PUT /api/v1/product-option-types/{id}**: Update a product option type (admin only)
- **DELETE /api/v1/product-option-types/{id}**: Delete a product option type (admin only)

### 5.9 Product Option Endpoints
- **POST /api/v1/product-options**: Create a product option (admin only)
- **PUT /api/v1/product-options/{id}**: Update a product option (admin only)
- **DELETE /api/v1/product-options/{id}**: Delete a product option (admin only)

### 5.10 Product Variant Endpoints
- **POST /api/v1/product-variants**: Create a product variant (admin only)
- **PUT /api/v1/product-variants/{id}**: Update a product variant (admin only)
- **DELETE /api/v1/product-variants/{id}**: Delete a product variant (admin only)

### 5.11 Variant Image Endpoints
- **POST /api/v1/variant-images**: Add an image to a variant (admin only)
- **PUT /api/v1/variant-images/{id}**: Update a variant image (admin only)
- **DELETE /api/v1/variant-images/{id}**: Delete a variant image (admin only)

### 5.12 Order Endpoints
- **GET /api/v1/orders**: Get all orders (admin only)
- **GET /api/v1/orders/my**: Get current user's orders
- **GET /api/v1/orders/{id}**: Get an order by ID
- **POST /api/v1/orders**: Create a new order
- **PUT /api/v1/orders/{id}**: Update an order (admin only)
- **DELETE /api/v1/orders/{id}**: Delete an order (admin only)

### 5.13 File Upload Endpoints
- **POST /api/v1/file-upload**: Upload a file to storage

## 6. Future Enhancements

### 6.1 Wishlist Functionality
- Allow users to save products to a wishlist
- Enable sharing of wishlists

### 6.2 Reviews and Ratings
- Allow users to rate and review products
- Display average ratings on product pages

### 6.3 Promotions and Discounts
- Implement coupon codes
- Support for percentage and fixed amount discounts
- Time-based promotions

### 6.4 Advanced Search
- Full-text search capabilities
- Filtering by multiple criteria
- Sorting options

### 6.5 Analytics Dashboard
- Sales reports
- Product performance metrics
- User behavior tracking

### 6.6 Notification System
- Email notifications for order status changes
- SMS notifications for critical updates
- In-app notifications

## 7. Conclusion

The Beanmart E-Commerce Backend API provides a solid foundation for a coffee shop's online business. With its comprehensive feature set, robust security measures, and scalable architecture, it is well-positioned to support both current needs and future growth. The system's modular design and clear API documentation make it easy to extend and integrate with other systems as the business evolves.