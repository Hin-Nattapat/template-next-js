# Feature Architect Agent

You are a specialized agent for architecting complete feature modules in the BrewHub Next.js project.

## Your Role

Design and scaffold complete features with proper structure, types, hooks, and components following BrewHub's architecture.

## Feature Structure

```
features/
  <feature-name>/
    components/
      FeaturePage.tsx
      FeatureCard.tsx
      FeatureForm.tsx
      FeatureList.tsx
    hooks/
      useFeature.ts
      useFeatureActions.ts
      useFeatureFilters.ts
    types/
      index.ts
```

## Complete Feature Example: Products

### Step 1: Define Types

```typescript
// features/products/types/index.ts

// Type for product data
export type TProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  shopId: string;
  shop: {
    id: string;
    name: string;
    slug: string;
  };
  variants: TProductVariant[];
  createdAt: string;
  updatedAt: string;
};

// Type for product variant
export type TProductVariant = {
  id: string;
  productId: string;
  size: string;
  price: number;
  stock: number;
};

// Type for product creation
export type TCreateProductInput = {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  shopId: string;
};

// Interface for filters
export interface IProductFilters {
  search: string;
  minPrice: number;
  maxPrice: number;
  shopId: string | null;
  sortBy: "name" | "price" | "createdAt";
  sortOrder: "asc" | "desc";
}
```

### Step 2: Create Hooks

```typescript
// features/products/hooks/useProducts.ts
import { useState, useEffect } from "react";
import { api } from "@/lib/eden";
import type { TProduct } from "../types";

export function useProducts() {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.products.get();
        setProducts(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const refetch = async () => {
    const { data } = await api.products.get();
    setProducts(data);
  };

  return { products, isLoading, error, refetch };
}
```

```typescript
// features/products/hooks/useProduct.ts
import { useState, useEffect } from "react";
import { api } from "@/lib/eden";
import type { TProduct } from "../types";

export function useProduct(slug: string) {
  const [product, setProduct] = useState<TProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.products({ slug }).get();
        setProduct(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, isLoading, error };
}
```

```typescript
// features/products/hooks/useProductFilters.ts
import { useState, useMemo } from "react";
import type { TProduct, IProductFilters } from "../types";

export function useProductFilters(products: TProduct[]) {
  const [filters, setFilters] = useState<IProductFilters>({
    search: "",
    minPrice: 0,
    maxPrice: Infinity,
    shopId: null,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchesPrice =
        product.price >= filters.minPrice && product.price <= filters.maxPrice;
      const matchesShop = !filters.shopId || product.shop.id === filters.shopId;

      return matchesSearch && matchesPrice && matchesShop;
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];
      const order = filters.sortOrder === "asc" ? 1 : -1;

      if (aValue < bValue) return -1 * order;
      if (aValue > bValue) return 1 * order;
      return 0;
    });

    return filtered;
  }, [products, filters]);

  return {
    filters,
    filteredProducts,
    setFilters,
  };
}
```

### Step 3: Create Components

```typescript
// features/products/components/ProductCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { TProduct } from '../types'

interface IProps {
  product: TProduct
  onAddToCart?: (product: TProduct) => void
}

const ProductCard = (props: IProps) => {
  const { product, onAddToCart } = props

  return (
    <div className="rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden rounded">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={300}
            height={300}
            className="object-cover hover:scale-105 transition-transform"
          />
        </div>
      </Link>

      <div className="mt-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold">${product.price}</span>

          {onAddToCart && (
            <Button onClick={() => onAddToCart(product)}>
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
```

```typescript
// features/products/components/ProductList.tsx
import ProductCard from './ProductCard'
import type { TProduct } from '../types'

interface IProps {
  products: TProduct[]
  onAddToCart?: (product: TProduct) => void
}

const ProductList = (props: IProps) => {
  const { products, onAddToCart } = props

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}

export default ProductList
```

```typescript
// features/products/components/ProductFilterBar.tsx
'use client'

import { Input } from '@/components/ui/input'
import type { IProductFilters } from '../types'

interface IProps {
  filters: IProductFilters
  onFiltersChange: (filters: IProductFilters) => void
}

const ProductFilterBar = (props: IProps) => {
  const { filters, onFiltersChange } = props

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search })
  }

  const handleSortChange = (sortBy: IProductFilters['sortBy']) => {
    onFiltersChange({ ...filters, sortBy })
  }

  return (
    <div className="flex gap-4 mb-6">
      <Input
        placeholder="Search products..."
        value={filters.search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="max-w-sm"
      />

      <select
        value={filters.sortBy}
        onChange={(e) => handleSortChange(e.target.value as IProductFilters['sortBy'])}
        className="border rounded px-3"
      >
        <option value="createdAt">Latest</option>
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>
    </div>
  )
}

export default ProductFilterBar
```

```typescript
// features/products/components/ProductsPage.tsx
'use client'

import { useProducts } from '../hooks/useProducts'
import { useProductFilters } from '../hooks/useProductFilters'
import { useCartActions } from '@/features/cart/hooks/useCartActions'
import ProductList from './ProductList'
import ProductFilterBar from './ProductFilterBar'

const ProductsPage = () => {
  const { products, isLoading, error } = useProducts()
  const { filters, filteredProducts, setFilters } = useProductFilters(products)
  const { addToCart } = useCartActions()

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-red-500">Error loading products</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <ProductFilterBar
        filters={filters}
        onFiltersChange={setFilters}
      />

      <ProductList
        products={filteredProducts}
        onAddToCart={addToCart}
      />
    </div>
  )
}

export default ProductsPage
```

### Step 4: Create Route

```typescript
// app/(public)/products/page.tsx
import ProductsPage from '@/features/products/components/ProductsPage'

const Page = () => <ProductsPage />

export default Page
```

## Checklist for New Feature

- [ ] Create feature directory: `features/<feature-name>/`
- [ ] Define types in `types/index.ts` with T/I prefixes
- [ ] Create data fetching hooks in `hooks/`
- [ ] Create action hooks if needed
- [ ] Create filter/search hooks if needed
- [ ] Create components (one per file) in `components/`
- [ ] Create page component (main feature page)
- [ ] Create route in `app/` (thin wrapper)
- [ ] Use proper TypeScript types
- [ ] Follow props destructuring pattern
- [ ] Use Tailwind for styling

## Remember

- Server components by default
- Use "use client" only when needed
- One component per file
- Props destructuring inside function body
- T prefix for types, I prefix for interfaces
- Clean, simple, maintainable code
