# Beanmart API Documentation

This documentation provides a comprehensive guide to the Beanmart API, an e-commerce backend system built with Node.js, Express, and TypeScript. The API follows REST principles and uses JSON for data exchange.

## Table of Contents

1. [Base URL](#base-url)
2. [Authentication](#authentication)
3. [Rate Limiting](#rate-limiting)
4. [Error Handling](#error-handling)
5. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication-endpoints)
   - [Users](#users-endpoints)
   - [User Addresses](#user-addresses-endpoints)
   - [Products](#products-endpoints)
   - [Categories](#categories-endpoints)
   - [Product Categories](#product-categories-endpoints)
   - [Product Images](#product-images-endpoints)
   - [Product Option Types](#product-option-types-endpoints)
   - [Product Options](#product-options-endpoints)
   - [Product Variants](#product-variants-endpoints)
   - [Variant Images](#variant-images-endpoints)
   - [Orders](#orders-endpoints)
   - [File Upload](#file-upload-endpoints)
6. [Data Models](#data-models)
7. [Response Format](#response-format)

## Base URL

All API endpoints are relative to the base URL:
```
http://localhost:3000/api/v1
```

For production environments, replace with your actual domain:
```
https://your-domain.com/api/v1
```

## Authentication

Most endpoints that modify data or access user-specific information require authentication. Authentication is implemented using JSON Web Tokens (JWT).

To authenticate, include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Admin Access

Some endpoints are restricted to admin users only. These are clearly marked in the documentation. Attempting to access these endpoints without admin privileges will result in a 403 Forbidden response.

## Rate Limiting

Currently, the API does not implement rate limiting. This may be added in future versions to prevent abuse.

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests:

- 200 OK - Successful GET, PUT, PATCH requests
- 201 Created - Successful POST requests
- 204 No Content - Successful DELETE requests
- 400 Bad Request - Invalid request data
- 401 Unauthorized - Missing or invalid authentication
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource not found
- 409 Conflict - Resource already exists
- 500 Internal Server Error - Server-side errors

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {}
}
```

For array responses:
```json
{
  "success": true,
  "data": []
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## API Endpoints

### Authentication Endpoints

#### Register a New User
```
POST /auth/register
```

Registers a new user in the system.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "User Example",
  "phone": "+6281234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "phone": "+6281234567890",
    "full_name": "User Example",
    "created_at": "2023-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User/Admin
```
POST /auth/login
```

Authenticates a user or admin and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "isAdmin": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "phone": "+6281234567890",
    "full_name": "User Example",
    "created_at": "2023-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User Profile
```
GET /auth/profile
```

Retrieves the profile information of the currently authenticated user or admin.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "phone": "+6281234567890",
    "full_name": "User Example",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

### Users Endpoints

#### Get All Users
```
GET /users
```

Retrieves a list of all users. This endpoint is typically restricted to admins.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "phone": "+6281234567890",
      "full_name": "User Example",
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get User by ID
```
GET /users/{id}
```

Retrieves a specific user by their ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "phone": "+6281234567890",
    "full_name": "User Example",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Create User
```
POST /users
```

Creates a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "phone": "+6281234567890",
  "full_name": "User Example",
  "password_hash": "hashed_password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "phone": "+6281234567890",
    "full_name": "User Example",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Update User
```
PUT /users/{id}
```

Updates an existing user's information.

**Request Body:**
```json
{
  "email": "updated@example.com",
  "phone": "+6281234567891",
  "full_name": "Updated User"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "updated@example.com",
    "phone": "+6281234567891",
    "full_name": "Updated User",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Delete User
```
DELETE /users/{id}
```

Deletes a user from the system.

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### Get User Addresses
```
GET /users/{id}/addresses
```

Retrieves all addresses associated with a specific user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "550e8400-e29b-41d4-a716-446655440001",
      "label": "Home",
      "recipient_name": "John Doe",
      "phone": "+6281234567890",
      "address_line1": "123 Main St",
      "address_line2": "Apt 4B",
      "city": "Jakarta",
      "state": "DKI Jakarta",
      "postal_code": "12345",
      "country": "ID",
      "is_default": true,
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create User Address
```
POST /users/{id}/addresses
```

Creates a new address for a specific user.

**Request Body:**
```json
{
  "label": "Home",
  "recipient_name": "John Doe",
  "phone": "+6281234567890",
  "address_line1": "123 Main St",
  "address_line2": "Apt 4B",
  "city": "Jakarta",
  "state": "DKI Jakarta",
  "postal_code": "12345",
  "country": "ID",
  "is_default": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "label": "Home",
    "recipient_name": "John Doe",
    "phone": "+6281234567890",
    "address_line1": "123 Main St",
    "address_line2": "Apt 4B",
    "city": "Jakarta",
    "state": "DKI Jakarta",
    "postal_code": "12345",
    "country": "ID",
    "is_default": true,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

### User Addresses Endpoints

#### Get All Addresses for a User
```
GET /user-addresses/user/{user_id}
```

Retrieves all addresses for a specific user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "550e8400-e29b-41d4-a716-446655440001",
      "label": "Home",
      "recipient_name": "John Doe",
      "phone": "+6281234567890",
      "address_line1": "123 Main St",
      "address_line2": "Apt 4B",
      "city": "Jakarta",
      "state": "DKI Jakarta",
      "postal_code": "12345",
      "country": "ID",
      "is_default": true,
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get User Address by ID
```
GET /user-addresses/{id}
```

Retrieves a specific user address by its ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "label": "Home",
    "recipient_name": "John Doe",
    "phone": "+6281234567890",
    "address_line1": "123 Main St",
    "address_line2": "Apt 4B",
    "city": "Jakarta",
    "state": "DKI Jakarta",
    "postal_code": "12345",
    "country": "ID",
    "is_default": true,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Create User Address
```
POST /user-addresses
```

Creates a new user address.

**Request Body:**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440001",
  "label": "Home",
  "recipient_name": "John Doe",
  "phone": "+6281234567890",
  "address_line1": "123 Main St",
  "address_line2": "Apt 4B",
  "city": "Jakarta",
  "state": "DKI Jakarta",
  "postal_code": "12345",
  "country": "ID",
  "is_default": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "label": "Home",
    "recipient_name": "John Doe",
    "phone": "+6281234567890",
    "address_line1": "123 Main St",
    "address_line2": "Apt 4B",
    "city": "Jakarta",
    "state": "DKI Jakarta",
    "postal_code": "12345",
    "country": "ID",
    "is_default": true,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Update User Address
```
PUT /user-addresses/{id}
```

Updates an existing user address.

**Request Body:**
```json
{
  "label": "Office",
  "recipient_name": "Jane Doe",
  "phone": "+6281234567891",
  "address_line1": "456 Business Ave",
  "address_line2": "Suite 100",
  "city": "Jakarta",
  "state": "DKI Jakarta",
  "postal_code": "54321",
  "country": "ID",
  "is_default": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "label": "Office",
    "recipient_name": "Jane Doe",
    "phone": "+6281234567891",
    "address_line1": "456 Business Ave",
    "address_line2": "Suite 100",
    "city": "Jakarta",
    "state": "DKI Jakarta",
    "postal_code": "54321",
    "country": "ID",
    "is_default": false,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Delete User Address
```
DELETE /user-addresses/{id}
```

Deletes a user address.

**Response:**
```json
{
  "success": true,
  "message": "User address deleted successfully"
}
```

#### Set User Address as Default
```
POST /user-addresses/{id}/set-default
```

Sets a specific user address as the default address for the user.

**Request Body:**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "label": "Home",
    "recipient_name": "John Doe",
    "phone": "+6281234567890",
    "address_line1": "123 Main St",
    "address_line2": "Apt 4B",
    "city": "Jakarta",
    "state": "DKI Jakarta",
    "postal_code": "12345",
    "country": "ID",
    "is_default": true,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

### Products Endpoints

#### Get All Products
```
GET /products
```

Retrieves a list of all products.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "slug": "coffee-beans",
      "name": "Coffee Beans",
      "short_description": "Premium quality coffee beans",
      "long_description": "Premium quality coffee beans sourced from the best plantations...",
      "source_url": "https://example.com/coffee-beans",
      "base_price": 125000,
      "base_compare_at_price": 150000,
      "currency": "IDR",
      "is_active": true,
      "sku": "CB-001",
      "weight_gram": 1000,
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Active Products
```
GET /products/active
```

Retrieves a list of all active products.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "slug": "coffee-beans",
      "name": "Coffee Beans",
      "short_description": "Premium quality coffee beans",
      "base_price": 125000,
      "currency": "IDR",
      "is_active": true,
      "weight_gram": 1000,
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Product by ID
```
GET /products/{id}
```

Retrieves a specific product by its ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "slug": "coffee-beans",
    "name": "Coffee Beans",
    "short_description": "Premium quality coffee beans",
    "long_description": "Premium quality coffee beans sourced from the best plantations...",
    "source_url": "https://example.com/coffee-beans",
    "base_price": 125000,
    "base_compare_at_price": 150000,
    "currency": "IDR",
    "is_active": true,
    "sku": "CB-001",
    "weight_gram": 1000,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get Product by Slug
```
GET /products/slug/{slug}
```

Retrieves a specific product by its slug.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "slug": "coffee-beans",
    "name": "Coffee Beans",
    "short_description": "Premium quality coffee beans",
    "long_description": "Premium quality coffee beans sourced from the best plantations...",
    "source_url": "https://example.com/coffee-beans",
    "base_price": 125000,
    "base_compare_at_price": 150000,
    "currency": "IDR",
    "is_active": true,
    "sku": "CB-001",
    "weight_gram": 1000,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Create Product (Admin Only)
```
POST /products
```

Creates a new product. This endpoint requires admin authentication.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**
```json
{
  "slug": "coffee-beans",
  "name": "Coffee Beans",
  "short_description": "Premium quality coffee beans",
  "long_description": "Premium quality coffee beans sourced from the best plantations...",
  "source_url": "https://example.com/coffee-beans",
  "base_price": 125000,
  "base_compare_at_price": 150000,
  "currency": "IDR",
  "is_active": true,
  "sku": "CB-001",
  "weight_gram": 1000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "slug": "coffee-beans",
    "name": "Coffee Beans",
    "short_description": "Premium quality coffee beans",
    "long_description": "Premium quality coffee beans sourced from the best plantations...",
    "source_url": "https://example.com/coffee-beans",
    "base_price": 125000,
    "base_compare_at_price": 150000,
    "currency": "IDR",
    "is_active": true,
    "sku": "CB-001",
    "weight_gram": 1000,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Update Product (Admin Only)
```
PUT /products/{id}
```

Updates an existing product. This endpoint requires admin authentication.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**
```json
{
  "name": "Updated Coffee Beans",
  "short_description": "Updated premium quality coffee beans",
  "base_price": 130000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "slug": "coffee-beans",
    "name": "Updated Coffee Beans",
    "short_description": "Updated premium quality coffee beans",
    "long_description": "Premium quality coffee beans sourced from the best plantations...",
    "source_url": "https://example.com/coffee-beans",
    "base_price": 130000,
    "base_compare_at_price": 150000,
    "currency": "IDR",
    "is_active": true,
    "sku": "CB-001",
    "weight_gram": 1000,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-02T00:00:00.000Z"
  }
}
```

#### Delete Product (Admin Only)
```
DELETE /products/{id}
```

Deletes a product. This endpoint requires admin authentication.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

#### Get Product Images
```
GET /products/{id}/images
```

Retrieves all images for a specific product.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "product_id": "550e8400-e29b-41d4-a716-446655440001",
      "image_url": "https://example.com/images/coffee-beans.jpg",
      "alt_text": "Coffee Beans",
      "sort_order": 1,
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Product Variants
```
GET /products/{id}/variants
```

Retrieves all variants for a specific product.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "product_id": "550e8400-e29b-41d4-a716-446655440001",
      "sku": "CB-MED-250",
      "price": 125000,
      "compare_at_price": 150000,
      "stock": 50,
      "weight_gram": 250,
      "option1_value": "Medium",
      "option2_value": "250g",
      "option3_value": "Whole Bean",
      "is_active": true,
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Active Product Variants
```
GET /products/{id}/variants/active
```

Retrieves all active variants for a specific product.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "product_id": "550e8400-e29b-41d4-a716-446655440001",
      "sku": "CB-MED-250",
      "price": 125000,
      "compare_at_price": 150000,
      "stock": 50,
      "weight_gram": 250,
      "option1_value": "Medium",
      "option2_value": "250g",
      "option3_value": "Whole Bean",
      "is_active": true,
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### Categories Endpoints

#### Get All Categories
```
GET /categories
```

Retrieves a list of all categories.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "slug": "coffee",
      "name": "Coffee"
    }
  ]
}
```

#### Get Category by ID
```
GET /categories/{id}
```

Retrieves a specific category by its ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "slug": "coffee",
    "name": "Coffee"
  }
}
```

#### Get Category by Slug
```
GET /categories/slug/{slug}
```

Retrieves a specific category by its slug.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "slug": "coffee",
    "name": "Coffee"
  }
}
```

#### Create Category
```
POST /categories
```

Creates a new category.

**Request Body:**
```json
{
  "slug": "coffee",
  "name": "Coffee"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "slug": "coffee",
    "name": "Coffee"
  }
}
```

#### Update Category
```
PUT /categories/{id}
```

Updates an existing category.

**Request Body:**
```json
{
  "name": "Updated Coffee"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "slug": "coffee",
    "name": "Updated Coffee"
  }
}
```

#### Delete Category
```
DELETE /categories/{id}
```

Deletes a category.

**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

#### Get Products for Category
```
GET /categories/{id}/products
```

Retrieves all products associated with a specific category.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "product_id": "550e8400-e29b-41d4-a716-446655440001",
      "category_id": "550e8400-e29b-41d4-a716-446655440002"
    }
  ]
}
```

### Product Categories Endpoints

#### Get All Product Categories
```
GET /product-categories
```

Retrieves a list of all product-category associations.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "product_id": "550e8400-e29b-41d4-a716-446655440001",
      "category_id": "550e8400-e29b-41d4-a716-446655440002"
    }
  ]
}
```

#### Get Product Category by ID
```
GET /product-categories/{id}
```

Retrieves a specific product-category association by its ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_id": "550e8400-e29b-41d4-a716-446655440001",
    "category_id": "550e8400-e29b-41d4-a716-446655440002"
  }
}
```

#### Create Product Category
```
POST /product-categories
```

Creates a new product-category association.

**Request Body:**
```json
{
  "product_id": "550e8400-e29b-41d4-a716-446655440001",
  "category_id": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_id": "550e8400-e29b-41d4-a716-446655440001",
    "category_id": "550e8400-e29b-41d4-a716-446655440002"
  }
}
```

#### Update Product Category
```
PUT /product-categories/{id}
```

Updates an existing product-category association.

**Request Body:**
```json
{
  "product_id": "550e8400-e29b-41d4-a716-446655440003",
  "category_id": "550e8400-e29b-41d4-a716-446655440004"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_id": "550e8400-e29b-41d4-a716-446655440003",
    "category_id": "550e8400-e29b-41d4-a716-446655440004"
  }
}
```

#### Delete Product Category
```
DELETE /product-categories/{id}
```

Deletes a product-category association.

**Response:**
```json
{
  "success": true,
  "message": "Product category deleted successfully"
}
```

### Product Images Endpoints

#### Get All Product Images
```
GET /product-images
```

Retrieves a list of all product images.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "product_id": "550e8400-e29b-41d4-a716-446655440001",
      "image_url": "https://example.com/images/coffee-beans.jpg",
      "alt_text": "Coffee Beans",
      "sort_order": 1,
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Product Image by ID
```
GET /product-images/{id}
```

Retrieves a specific product image by its ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_id": "550e8400-e29b-41d4-a716-446655440001",
    "image_url": "https://example.com/images/coffee-beans.jpg",
    "alt_text": "Coffee Beans",
    "sort_order": 1,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Create Product Image
```
POST /product-images
```

Creates a new product image.

**Request Body:**
```json
{
  "product_id": "550e8400-e29b-41d4-a716-446655440001",
  "image_url": "https://example.com/images/coffee-beans.jpg",
  "alt_text": "Coffee Beans",
  "sort_order": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_id": "550e8400-e29b-41d4-a716-446655440001",
    "image_url": "https://example.com/images/coffee-beans.jpg",
    "alt_text": "Coffee Beans",
    "sort_order": 1,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Update Product Image
```
PUT /product-images/{id}
```

Updates an existing product image.

**Request Body:**
```json
{
  "alt_text": "Premium Coffee Beans",
  "sort_order": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_id": "550e8400-e29b-41d4-a716-446655440001",
    "image_url": "https://example.com/images/coffee-beans.jpg",
    "alt_text": "Premium Coffee Beans",
    "sort_order": 2,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Delete Product Image
```
DELETE /product-images/{id}
```

Deletes a product image.

**Response:**
```json
{
  "success": true,
  "message": "Product image deleted successfully"
}
```

### Product Option Types Endpoints

#### Get All Product Option Types
```
GET /product-option-types
```

Retrieves a list of all product option types.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "product_id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Size",
      "sort_order": 1,
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Product Option Type by ID
```
GET /product-option-types/{id}
```

Retrieves a specific product option type by its ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Size",
    "sort_order": 1,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Create Product Option Type
```
POST /product-option-types
```

Creates a new product option type.

**Request Body:**
```json
{
  "product_id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Size",
  "sort_order": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Size",
    "sort_order": 1,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Update Product Option Type
```
PUT /product-option-types/{id}
```

Updates an existing product option type.

**Request Body:**
```json
{
  "name": "Weight",
  "sort_order": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Weight",
    "sort_order": 2,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Delete Product Option Type
```
DELETE /product-option-types/{id}
```

Deletes a product option type.

**Response:**
```json
{
  "success": true,
  "message": "Product option type deleted successfully"
}
```

### Product Options Endpoints

#### Get All Product Options
```
GET /product-options
```

Retrieves a list of all product options.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "product_option_type_id": "550e8400-e29b-41d4-a716-446655440001",
      "value": "250g",
      "sort_order": 1,
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Product Option by ID
```
GET /product-options/{id}
```

Retrieves a specific product option by its ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_option_type_id": "550e8400-e29b-41d4-a716-446655440001",
    "value": "250g",
    "sort_order": 1,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Create Product Option
```
POST /product-options
```

Creates a new product option.

**Request Body:**
```json
{
  "product_option_type_id": "550e8400-e29b-41d4-a716-446655440001",
  "value": "250g",
  "sort_order": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_option_type_id": "550e8400-e29b-41d4-a716-446655440001",
    "value": "250g",
    "sort_order": 1,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Update Product Option
```
PUT /product-options/{id}
```

Updates an existing product option.

**Request Body:**
```json
{
  "value": "500g",
  "sort_order": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_option_type_id": "550e8400-e29b-41d4-a716-446655440001",
    "value": "500g",
    "sort_order": 2,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Delete Product Option
```
DELETE /product-options/{id}
```

Deletes a product option.

**Response:**
```json
{
  "success": true,
  "message": "Product option deleted successfully"
}
```

### Product Variants Endpoints

#### Get All Product Variants for a Product
```
GET /product-variants/product/{product_id}
```

Retrieves all variants for a specific product.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "product_id": "550e8400-e29b-41d4-a716-446655440001",
      "sku": "CB-MED-250",
      "price": 125000,
      "compare_at_price": 150000,
      "stock": 50,
      "weight_gram": 250,
      "option1_value": "Medium",
      "option2_value": "250g",
      "option3_value": "Whole Bean",
      "is_active": true,
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Active Product Variants for a Product
```
GET /product-variants/product/{product_id}/active
```

Retrieves all active variants for a specific product.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "product_id": "550e8400-e29b-41d4-a716-446655440001",
      "sku": "CB-MED-250",
      "price": 125000,
      "compare_at_price": 150000,
      "stock": 50,
      "weight_gram": 250,
      "option1_value": "Medium",
      "option2_value": "250g",
      "option3_value": "Whole Bean",
      "is_active": true,
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Product Variant by ID
```
GET /product-variants/{id}
```

Retrieves a specific product variant by its ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_id": "550e8400-e29b-41d4-a716-446655440001",
    "sku": "CB-MED-250",
    "price": 125000,
    "compare_at_price": 150000,
    "stock": 50,
    "weight_gram": 250,
    "option1_value": "Medium",
    "option2_value": "250g",
    "option3_value": "Whole Bean",
    "is_active": true,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get Product Variant by SKU
```
GET /product-variants/sku/{sku}
```

Retrieves a specific product variant by its SKU.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_id": "550e8400-e29b-41d4-a716-446655440001",
    "sku": "CB-MED-250",
    "price": 125000,
    "compare_at_price": 150000,
    "stock": 50,
    "weight_gram": 250,
    "option1_value": "Medium",
    "option2_value": "250g",
    "option3_value": "Whole Bean",
    "is_active": true,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Create Product Variant
```
POST /product-variants
```

Creates a new product variant.

**Request Body:**
```json
{
  "product_id": "550e8400-e29b-41d4-a716-446655440001",
  "sku": "CB-MED-250",
  "price": 125000,
  "compare_at_price": 150000,
  "stock": 50,
  "weight_gram": 250,
  "option1_value": "Medium",
  "option2_value": "250g",
  "option3_value": "Whole Bean",
  "is_active": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_id": "550e8400-e29b-41d4-a716-446655440001",
    "sku": "CB-MED-250",
    "price": 125000,
    "compare_at_price": 150000,
    "stock": 50,
    "weight_gram": 250,
    "option1_value": "Medium",
    "option2_value": "250g",
    "option3_value": "Whole Bean",
    "is_active": true,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Update Product Variant
```
PUT /product-variants/{id}
```

Updates an existing product variant.

**Request Body:**
```json
{
  "price": 130000,
  "stock": 45
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_id": "550e8400-e29b-41d4-a716-446655440001",
    "sku": "CB-MED-250",
    "price": 130000,
    "compare_at_price": 150000,
    "stock": 45,
    "weight_gram": 250,
    "option1_value": "Medium",
    "option2_value": "250g",
    "option3_value": "Whole Bean",
    "is_active": true,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-02T00:00:00.000Z"
  }
}
```

#### Delete Product Variant
```
DELETE /product-variants/{id}
```

Deletes a product variant.

**Response:**
```json
{
  "success": true,
  "message": "Product variant deleted successfully"
}
```

### Variant Images Endpoints

#### Get All Variant Images
```
GET /variant-images
```

Retrieves a list of all variant images.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "product_variant_id": "550e8400-e29b-41d4-a716-446655440001",
      "image_url": "https://example.com/images/coffee-beans-medium.jpg",
      "alt_text": "Medium Roast Coffee Beans",
      "sort_order": 1,
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Variant Image by ID
```
GET /variant-images/{id}
```

Retrieves a specific variant image by its ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_variant_id": "550e8400-e29b-41d4-a716-446655440001",
    "image_url": "https://example.com/images/coffee-beans-medium.jpg",
    "alt_text": "Medium Roast Coffee Beans",
    "sort_order": 1,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Create Variant Image
```
POST /variant-images
```

Creates a new variant image.

**Request Body:**
```json
{
  "product_variant_id": "550e8400-e29b-41d4-a716-446655440001",
  "image_url": "https://example.com/images/coffee-beans-medium.jpg",
  "alt_text": "Medium Roast Coffee Beans",
  "sort_order": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_variant_id": "550e8400-e29b-41d4-a716-446655440001",
    "image_url": "https://example.com/images/coffee-beans-medium.jpg",
    "alt_text": "Medium Roast Coffee Beans",
    "sort_order": 1,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Update Variant Image
```
PUT /variant-images/{id}
```

Updates an existing variant image.

**Request Body:**
```json
{
  "alt_text": "Premium Medium Roast Coffee Beans",
  "sort_order": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "product_variant_id": "550e8400-e29b-41d4-a716-446655440001",
    "image_url": "https://example.com/images/coffee-beans-medium.jpg",
    "alt_text": "Premium Medium Roast Coffee Beans",
    "sort_order": 2,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Delete Variant Image
```
DELETE /variant-images/{id}
```

Deletes a variant image.

**Response:**
```json
{
  "success": true,
  "message": "Variant image deleted successfully"
}
```

### Orders Endpoints

#### Get All Orders (Admin Only)
```
GET /orders
```

Retrieves a list of all orders. This endpoint requires admin authentication.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "123e4567-e89b-12d3-a456-426614174000",
      "order_number": "ORD-1234567890-123",
      "status": "pending",
      "total_amount": 250000,
      "currency": "IDR",
      "shipping_address": { "name": "John Doe", "address": "123 Main St", "city": "Jakarta" },
      "billing_address": { "name": "John Doe", "address": "123 Main St", "city": "Jakarta" },
      "notes": "Please deliver after 5 PM",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Current User's Orders
```
GET /orders/my
```

Retrieves all orders for the currently authenticated user.

**Headers:**
```
Authorization: Bearer <user-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "123e4567-e89b-12d3-a456-426614174000",
      "order_number": "ORD-1234567890-123",
      "status": "pending",
      "total_amount": 250000,
      "currency": "IDR",
      "shipping_address": { "name": "John Doe", "address": "123 Main St", "city": "Jakarta" },
      "billing_address": { "name": "John Doe", "address": "123 Main St", "city": "Jakarta" },
      "notes": "Please deliver after 5 PM",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Order by ID
```
GET /orders/{id}
```

Retrieves a specific order by its ID.

**Headers:**
```
Authorization: Bearer <user-or-admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "order_number": "ORD-1234567890-123",
    "status": "pending",
    "total_amount": 250000,
    "currency": "IDR",
    "shipping_address": { "name": "John Doe", "address": "123 Main St", "city": "Jakarta" },
    "billing_address": { "name": "John Doe", "address": "123 Main St", "city": "Jakarta" },
    "notes": "Please deliver after 5 PM",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Create Order
```
POST /orders
```

Creates a new order for the currently authenticated user.

**Headers:**
```
Authorization: Bearer <user-jwt-token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productVariantId": "770e8400-e29b-41d4-a716-446655440000",
      "quantity": 2,
      "pricePerUnit": 125000,
      "totalPrice": 250000
    }
  ],
  "shipping_address": { "name": "John Doe", "address": "123 Main St", "city": "Jakarta" },
  "billing_address": { "name": "John Doe", "address": "123 Main St", "city": "Jakarta" },
  "notes": "Please deliver after 5 PM"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "order_number": "ORD-1234567890-123",
    "status": "pending",
    "total_amount": 250000,
    "currency": "IDR",
    "shipping_address": { "name": "John Doe", "address": "123 Main St", "city": "Jakarta" },
    "billing_address": { "name": "John Doe", "address": "123 Main St", "city": "Jakarta" },
    "notes": "Please deliver after 5 PM",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Update Order (Admin Only)
```
PUT /orders/{id}
```

Updates an existing order. This endpoint requires admin authentication.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Order confirmed and will be shipped tomorrow"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "order_number": "ORD-1234567890-123",
    "status": "confirmed",
    "total_amount": 250000,
    "currency": "IDR",
    "shipping_address": { "name": "John Doe", "address": "123 Main St", "city": "Jakarta" },
    "billing_address": { "name": "John Doe", "address": "123 Main St", "city": "Jakarta" },
    "notes": "Order confirmed and will be shipped tomorrow",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-02T00:00:00.000Z"
  }
}
```

#### Delete Order (Admin Only)
```
DELETE /orders/{id}
```

Deletes an order. This endpoint requires admin authentication.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Order deleted successfully"
}
```

### File Upload Endpoints

#### Upload File
```
POST /file-upload
```

Uploads a file to the server.

**Headers:**
```
Content-Type: multipart/form-data
```

**Form Data:**
```
file: [file data]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "uploaded-file.jpg",
    "url": "https://example.com/uploads/uploaded-file.jpg",
    "size": 123456
  }
}
```

## Data Models

### User
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "phone": "+6281234567890",
  "full_name": "User Example",
  "password_hash": "hashed_password",
  "created_at": "2023-01-01T00:00:00.000Z"
}
```

### User Address
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440001",
  "label": "Home",
  "recipient_name": "John Doe",
  "phone": "+6281234567890",
  "address_line1": "123 Main St",
  "address_line2": "Apt 4B",
  "city": "Jakarta",
  "state": "DKI Jakarta",
  "postal_code": "12345",
  "country": "ID",
  "is_default": true,
  "created_at": "2023-01-01T00:00:00.000Z"
}
```

### Product
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "slug": "coffee-beans",
  "name": "Coffee Beans",
  "short_description": "Premium quality coffee beans",
  "long_description": "Premium quality coffee beans sourced from the best plantations...",
  "source_url": "https://example.com/coffee-beans",
  "base_price": 125000,
  "base_compare_at_price": 150000,
  "currency": "IDR",
  "is_active": true,
  "sku": "CB-001",
  "weight_gram": 1000,
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

### Category
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "slug": "coffee",
  "name": "Coffee"
}
```

### Product Category
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "product_id": "550e8400-e29b-41d4-a716-446655440001",
  "category_id": "550e8400-e29b-41d4-a716-446655440002"
}
```

### Product Image
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "product_id": "550e8400-e29b-41d4-a716-446655440001",
  "image_url": "https://example.com/images/coffee-beans.jpg",
  "alt_text": "Coffee Beans",
  "sort_order": 1,
  "created_at": "2023-01-01T00:00:00.000Z"
}
```

### Product Option Type
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "product_id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Size",
  "sort_order": 1,
  "created_at": "2023-01-01T00:00:00.000Z"
}
```

### Product Option
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "product_option_type_id": "550e8400-e29b-41d4-a716-446655440001",
  "value": "250g",
  "sort_order": 1,
  "created_at": "2023-01-01T00:00:00.000Z"
}
```

### Product Variant
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "product_id": "550e8400-e29b-41d4-a716-446655440001",
  "sku": "CB-MED-250",
  "price": 125000,
  "compare_at_price": 150000,
  "stock": 50,
  "weight_gram": 250,
  "option1_value": "Medium",
  "option2_value": "250g",
  "option3_value": "Whole Bean",
  "is_active": true,
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

### Variant Image
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "product_variant_id": "550e8400-e29b-41d4-a716-446655440001",
  "image_url": "https://example.com/images/coffee-beans-medium.jpg",
  "alt_text": "Medium Roast Coffee Beans",
  "sort_order": 1,
  "created_at": "2023-01-01T00:00:00.000Z"
}
```

### Order
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "order_number": "ORD-1234567890-123",
  "status": "pending",
  "total_amount": 250000,
  "currency": "IDR",
  "shipping_address": { "name": "John Doe", "address": "123 Main St", "city": "Jakarta" },
  "billing_address": { "name": "John Doe", "address": "123 Main St", "city": "Jakarta" },
  "notes": "Please deliver after 5 PM",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

### Order Item
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "order_id": "550e8400-e29b-41d4-a716-446655440000",
  "product_variant_id": "770e8400-e29b-41d4-a716-446655440000",
  "quantity": 2,
  "price_per_unit": 125000,
  "total_price": 250000,
  "created_at": "2023-01-01T00:00:00.000Z"
}
```

## API Access

The API documentation is also available in interactive format through Swagger UI at:
```
http://localhost:3000/api-docs
```

For programmatic access to the API specification, you can retrieve the JSON directly at:
```
http://localhost:3000/api-docs.json
```

This comprehensive documentation should provide all the information needed for developers to integrate with the Beanmart API effectively.