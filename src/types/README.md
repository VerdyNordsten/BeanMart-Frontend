# Type System Documentation

This directory contains a comprehensive type system that mirrors the database schema and provides consistent API response types throughout the application.

## Structure

```
/types
├─ domain/          // Mirror DB schema (entities)
│   ├─ product.ts   // Product, Category, RoastLevel, ProductVariant, VariantImage
│   ├─ user.ts      // User, UserAddress, Admin
│   ├─ order.ts     // Order, OrderItem, OrderStatus
│   └─ index.ts     // Re-export all domain types
├─ api/             // Request/response DTOs
│   ├─ common.ts    // Generic API response types
│   ├─ product.ts   // Product API types
│   ├─ user.ts      // User API types
│   ├─ order.ts     // Order API types
│   └─ index.ts     // Re-export all API types
└─ index.ts         // Re-export everything
```

## Usage Examples

### 1. Using Domain Types in Components

```typescript
import { ProductWithRelations, Category, OrderStatus } from '@/types';

// Component props
interface ProductCardProps {
  product: ProductWithRelations;
  onAddToCart: (variantId: string, quantity: number) => void;
}

// State management
const [products, setProducts] = useState<ProductWithRelations[]>([]);
const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
const [orderStatus, setOrderStatus] = useState<OrderStatus>('pending');
```

### 2. Using API Types with Fetchers

```typescript
import { productsApi } from '@/lib/api';
import { GetProductsResponse, CreateProductRequest } from '@/types';

// API calls with proper typing
const fetchProducts = async (): Promise<GetProductsResponse> => {
  return await productsApi.getProducts({
    page: 1,
    limit: 12,
    category: 'single-origin',
    is_active: true
  });
};

// Creating new products
const createProduct = async (data: CreateProductRequest) => {
  return await productsApi.createProduct(data);
};
```

### 3. Type-Safe API Responses

```typescript
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import { ProductWithRelations } from '@/types';

const { data, loading, error } = useQuery({
  queryKey: ['products'],
  queryFn: () => productsApi.getProducts(),
  select: (response) => response.data, // Automatically typed as ProductWithRelations[]
});
```

## Key Features

### ✅ Database Schema Consistency
- All types mirror the exact database schema
- Uses snake_case naming convention
- Includes proper nullable fields and defaults
- Matches PostgreSQL data types (UUID, TIMESTAMPTZ, JSONB, etc.)

### ✅ Comprehensive API Coverage
- Request/response types for all endpoints
- Pagination support
- Error handling types
- Upload/File handling types

### ✅ Type Safety
- Full TypeScript support
- Compile-time error checking
- IntelliSense autocomplete
- Refactoring safety

### ✅ Reusability
- Centralized type definitions
- No duplicate type definitions
- Consistent across components
- Easy to maintain and update

## Migration Guide

### Before (Old Way)
```typescript
// Inline type definitions
interface Product {
  id: string;
  name: string;
  price: number;
  // ... inconsistent naming
}

// Duplicate definitions across files
interface ApiProduct {
  id: string;
  productName: string; // Different naming!
  // ...
}
```

### After (New Way)
```typescript
// Centralized, consistent types
import { Product, ProductWithRelations } from '@/types';

// Consistent naming throughout
const product: ProductWithRelations = {
  id: 'uuid',
  name: 'Coffee Name',
  price: 25.99,
  // ... all fields match database schema
};
```

## Best Practices

1. **Always import from centralized types**: `import { Product } from '@/types'`
2. **Use domain types for data models**: `Product`, `User`, `Order`
3. **Use API types for requests/responses**: `CreateProductRequest`, `GetProductsResponse`
4. **Leverage relation types when needed**: `ProductWithRelations`, `OrderWithItemsAndProducts`
5. **Keep types in sync with database schema**: Update types when schema changes
