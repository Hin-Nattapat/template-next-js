# Create New Zustand Store

Use this prompt when creating a new Zustand store in the BrewHub project.

## Requirements

1. Store naming:
   - Export store as `use<Name>Store` hook
   - Example: `useCartStore`, `useAuthStore`, `useUIStore`

2. Type naming:
   - Use `T` prefix for types: `TCartState`, `TCartItem`
   - Use `I` prefix for interfaces: `ICartActions`

3. File organization:
   - Stores go in: `stores/`
   - One store per file
   - File name matches store name: `cartStore.ts`

4. Store design:
   - Keep stores focused and small
   - Separate state from actions
   - Avoid complex side-effects in stores
   - Use middleware when needed (persist, devtools)

## Basic Template

```typescript
import { create } from "zustand";

type TStoreState = {
  // State properties
  items: string[];
  count: number;

  // Actions
  addItem: (item: string) => void;
  increment: () => void;
  reset: () => void;
};

export const useStoreNameStore = create<TStoreState>(set => ({
  // Initial state
  items: [],
  count: 0,

  // Action implementations
  addItem: item =>
    set(state => ({
      items: [...state.items, item],
    })),

  increment: () =>
    set(state => ({
      count: state.count + 1,
    })),

  reset: () =>
    set({
      items: [],
      count: 0,
    }),
}));
```

## Example: Cart Store

```typescript
// stores/cartStore.ts
import { create } from "zustand";

type TCartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

type TCartState = {
  items: TCartItem[];
  addItem: (item: TCartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  getTotal: () => number;
};

export const useCartStore = create<TCartState>((set, get) => ({
  items: [],

  addItem: item =>
    set(state => {
      const existingItem = state.items.find(i => i.id === item.id);

      if (existingItem) {
        return {
          items: state.items.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
          ),
        };
      }

      return { items: [...state.items, item] };
    }),

  removeItem: id =>
    set(state => ({
      items: state.items.filter(item => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set(state => ({
      items: state.items.map(item => (item.id === id ? { ...item, quantity } : item)),
    })),

  clear: () => set({ items: [] }),

  getTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
```

## Example: Auth Store

```typescript
// stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type TUser = {
  id: string;
  email: string;
  name: string;
};

type TAuthState = {
  user: TUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: TUser, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<TAuthState>()(
  persist(
    set => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: state => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
```

## Example: UI Store

```typescript
// stores/uiStore.ts
import { create } from "zustand";

type TModal = "cart" | "auth" | "product-details" | null;

type TUIState = {
  isSidebarOpen: boolean;
  activeModal: TModal;
  isLoading: boolean;

  toggleSidebar: () => void;
  openModal: (modal: TModal) => void;
  closeModal: () => void;
  setLoading: (loading: boolean) => void;
};

export const useUIStore = create<TUIState>(set => ({
  isSidebarOpen: false,
  activeModal: null,
  isLoading: false,

  toggleSidebar: () =>
    set(state => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),

  openModal: modal => set({ activeModal: modal }),

  closeModal: () => set({ activeModal: null }),

  setLoading: loading => set({ isLoading: loading }),
}));
```

## Using Stores in Components

```typescript
'use client'

import { useCartStore } from '@/stores/cartStore'
import type { TProduct } from '@/features/products/types'

interface IProps {
  product: TProduct
}

const ProductCard = (props: IProps) => {
  const { product } = props

  // Select only what you need
  const addItem = useCartStore((state) => state.addItem)
  const items = useCartStore((state) => state.items)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    })
  }

  return (
    <button onClick={handleAddToCart}>
      Add to Cart ({items.length})
    </button>
  )
}

export default ProductCard
```

## Store with Middleware

### Persist Middleware

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create<TCartState>()(
  persist(
    set => ({
      items: [],
      addItem: item =>
        set(state => ({
          items: [...state.items, item],
        })),
    }),
    {
      name: "cart-storage", // localStorage key
      partialize: state => ({ items: state.items }), // Only persist items
    },
  ),
);
```

### DevTools Middleware

```typescript
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useCartStore = create<TCartState>()(
  devtools(
    set => ({
      items: [],
      addItem: item =>
        set(state => ({
          items: [...state.items, item],
        })),
    }),
    { name: "CartStore" },
  ),
);
```

### Combined Middleware

```typescript
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useCartStore = create<TCartState>()(
  devtools(
    persist(
      set => ({
        items: [],
        addItem: item =>
          set(state => ({
            items: [...state.items, item],
          })),
      }),
      { name: "cart-storage" },
    ),
    { name: "CartStore" },
  ),
);
```

## Best Practices

1. **Keep stores focused**: One store per domain (cart, auth, UI)
2. **Avoid deep nesting**: Keep state structure flat
3. **Use selectors**: Only select what you need in components
4. **Computed values**: Use functions for derived state
5. **Actions over direct state**: Expose actions, not raw state setters
6. **TypeScript**: Always type your state and actions
7. **Persist selectively**: Only persist necessary data
8. **Reset state**: Provide reset/clear actions

## Performance Tips

```typescript
// ❌ Bad: Will re-render on any state change
const { items, addItem, total } = useCartStore();

// ✅ Good: Only re-renders when items change
const items = useCartStore(state => state.items);
const addItem = useCartStore(state => state.addItem);
```
