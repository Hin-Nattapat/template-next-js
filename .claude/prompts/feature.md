# Create New Feature

Use this prompt when creating a new feature module in the BrewHub project.

## Feature Structure

Each feature should have its own directory under `features/` with the following structure:

```
features/
  <feature-name>/
    components/
      FeaturePage.tsx        # Main page component
      FeatureCard.tsx        # Card component
      FeatureForm.tsx        # Form component
      ...
    hooks/
      useFeature.ts          # Data fetching hook
      useFeatureActions.ts   # Action hooks
      useFeatureFilters.ts   # Filter/search hooks
      ...
    types/
      index.ts               # Type definitions
```

## Steps to Create a Feature

1. Create feature directory structure
2. Define types in `types/index.ts`
3. Create data fetching hooks
4. Create components (one per file)
5. Create page route in `app/`

## Example: Products Feature

### 1. Types Definition

```typescript
// features/products/types/index.ts
export type TProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  shop: {
    id: string;
    name: string;
  };
  variants: TProductVariant[];
};

export type TProductVariant = {
  id: string;
  size: string;
  price: number;
  stock: number;
};

export interface IProductFilters {
  search: string;
  minPrice: number;
  maxPrice: number;
  shopId: string | null;
}
```

### 2. Data Hook

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

  return { products, isLoading, error };
}
```

### 3. Components

```typescript
// features/products/components/ProductCard.tsx
import Image from 'next/image'
import type { TProduct } from '../types'

interface IProps {
  product: TProduct
}

const ProductCard = (props: IProps) => {
  const { product } = props

  return (
    <div className="rounded-lg border p-4">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={300}
        height={300}
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.description}</p>
      <span className="text-xl font-bold">${product.price}</span>
    </div>
  )
}

export default ProductCard
```

```typescript
// features/products/components/ProductsPage.tsx
'use client'

import { useProducts } from '../hooks/useProducts'
import ProductCard from './ProductCard'

const ProductsPage = () => {
  const { products, isLoading, error } = useProducts()

  if (isLoading) {
    return <div>Loading products...</div>
  }

  if (error) {
    return <div>Error loading products</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductsPage
```

### 4. Route Page

```typescript
// app/(public)/products/page.tsx
import ProductsPage from '@/features/products/components/ProductsPage'

const Page = () => <ProductsPage />

export default Page
```

## Checklist

- [ ] Create feature directory under `features/`
- [ ] Define types in `types/index.ts`
- [ ] Create necessary hooks in `hooks/`
- [ ] Create components (one per file) in `components/`
- [ ] Create route in `app/` (thin wrapper)
- [ ] Use "use client" only when needed
- [ ] Follow const + export default pattern
- [ ] Add proper TypeScript types
- [ ] Use Tailwind for styling
