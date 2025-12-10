# Create New Custom Hook

Use this prompt when creating a new custom hook in the BrewHub project.

## Requirements

1. Hook naming:
   - Must start with `use` prefix
   - Use descriptive names: `useProducts`, `useAuth`, `useCartActions`

2. Type naming:
   - Use `T` prefix for type aliases: `TProduct`, `TFilterState`
   - Use `I` prefix for interfaces: `IProductFilters`

3. File organization:
   - Hooks go in: `features/<feature>/hooks/`
   - One hook per file
   - File name matches hook name: `useProducts.ts`

4. Separation of concerns:
   - Data fetching logic goes in hooks
   - Business logic goes in hooks
   - State management can use Zustand stores
   - UI components should be thin, calling hooks for logic

5. Return values:
   - Return objects for multiple values: `{ data, isLoading, error }`
   - Use consistent naming across hooks

## Template

```typescript
import { useState, useEffect } from "react";
import { api } from "@/lib/eden";
import type { TSomeType } from "../types";

export function useHookName() {
  const [data, setData] = useState<TSomeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await api.endpoint.get();
        setData(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}
```

## Examples

### Data Fetching Hook

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

### Actions Hook with Zustand

```typescript
// features/cart/hooks/useCartActions.ts
import { useCartStore } from "@/stores/cartStore";
import type { TProduct } from "@/features/products/types";

export function useCartActions() {
  const addItem = useCartStore(state => state.addItem);
  const removeItem = useCartStore(state => state.removeItem);
  const clear = useCartStore(state => state.clear);

  const addToCart = (product: TProduct, quantity: number = 1) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
    });
  };

  return {
    addToCart,
    removeItem,
    clearCart: clear,
  };
}
```

### Filter Hook with State

```typescript
// features/products/hooks/useProductFilters.ts
import { useState, useMemo } from "react";
import type { TProduct } from "../types";

type TFilterState = {
  search: string;
  minPrice: number;
  maxPrice: number;
  shopId: string | null;
};

export function useProductFilters(products: TProduct[]) {
  const [filters, setFilters] = useState<TFilterState>({
    search: "",
    minPrice: 0,
    maxPrice: Infinity,
    shopId: null,
  });

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchesPrice =
        product.price >= filters.minPrice && product.price <= filters.maxPrice;
      const matchesShop = !filters.shopId || product.shop.id === filters.shopId;

      return matchesSearch && matchesPrice && matchesShop;
    });
  }, [products, filters]);

  return {
    filters,
    setFilters,
    filteredProducts,
  };
}
```
