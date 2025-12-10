# BrewHub Web – Claude.md

This document defines how Claude (or any AI assistant) should work on the
frontend (Next.js) repository of BrewHub. Follow these rules strictly to keep
the codebase consistent with the owner's style and project vision.

==================================================

1. # PROJECT OVERVIEW

Tech stack:

- Framework: Next.js 16 (App Router, TypeScript)
- UI: shadcn/ui
- Icons: lucide-react
- State management: Zustand
- API client: Eden Treaty (using App type from BrewHub API)
- Styling: Tailwind CSS v4, clean, minimal, component-driven

Core ideas:

- E-commerce for coffee beans (multi-shop, product variants)
- Basic cart + checkout (mock payment)
- Coffee journal (BrewLog) tied to products and orders
- "My Beans" concept in the future

Owner's coding philosophy:

- Split components aggressively
- Separate business logic into custom hooks
- Clean, simple, not over-engineered
- One component per file
- Prefer const component + export default

# ================================================== 2. NAMING CONVENTIONS (CRITICAL - FOLLOW EXACTLY)

2.1 FILES & FOLDERS

Rule: Always use kebab-case for all file and folder names

Examples:

```
✅ product-card.tsx
✅ use-products.ts
✅ cart.store.ts
✅ products.service.ts
✅ app-form-label.tsx

❌ ProductCard.tsx
❌ useProducts.ts
❌ cartStore.ts
```

One component per file - NO EXCEPTIONS
One logical unit per file
Clear, descriptive names

2.2 FOLDER STRUCTURE

Recommended structure (may be slightly adjusted as project evolves):

```
app/
  layout.tsx
  page.tsx

  (public)/
    products/
      page.tsx
    product/
      [slug]/
        page.tsx
    shops/
      page.tsx
    shop/
      [slug]/
        page.tsx
    journal/
      page.tsx
    cart/
      page.tsx

  (auth)/
    login/
      page.tsx
    register/
      page.tsx

features/
  products/
    components/
      products-page.tsx
      product-card.tsx
      product-variant-selector.tsx
      product-filter-bar.tsx
    hooks/
      use-products.ts
      use-product-detail.ts
      use-product-filters.ts
    services/
      products.service.ts
    types/
      index.ts
  shops/
    components/
      shops-page.tsx
      shop-card.tsx
    hooks/
      use-shops.ts
  cart/
    components/
      cart-page.tsx
      cart-item.tsx
      cart-summary.tsx
    hooks/
      use-cart-actions.ts
  journal/
    components/
      journal-page.tsx
      brew-log-list.tsx
      brew-log-form.tsx
    hooks/
      use-journal.ts
  auth/
    components/
      login-form.tsx
      register-form.tsx
    hooks/
      use-auth.ts

components/
  ui/           → shadcn primitives only
  common/       → BrewHub-specific reusable components
  form/         → Form components
  layout/       → Layout components (PageHeader, etc.)

stores/
  cart.store.ts
  auth.store.ts
  ui.store.ts

types/
  global.ts     → Global reusable types
  api.ts        → Backend API types

lib/
  eden.ts       → Eden Treaty client
  utils.ts
  config.ts

styles/
  globals.css
```

Rules:

- Route-level files in app/ should be as thin as possible
- Most UI and logic lives in feature folders
- All files use kebab-case naming

  2.3 REACT COMPONENTS

Component name: PascalCase
File name: kebab-case
One component per file (STRICT RULE)

Declaration Style (REQUIRED):

```typescript
// ✅ CORRECT - Always use this pattern
interface IProps {
  title: string
  description?: string
}

const ProductCard = (props: IProps) => {
  const { title, description } = props

  return <div>{title}</div>
}

export default ProductCard
```

```typescript
// ❌ WRONG - Never use this pattern
export default function ProductCard({ title }: IProps) {
  return <div>{title}</div>
}
```

Key Rules:

1. Define as `const ComponentName`
2. Accept `props: IProps` as parameter
3. Destructure props inside function body (NOT in parameters)
4. `export default ComponentName` at bottom

For async server components:

```typescript
interface IProps {
  slug: string
}

const ProductDetailPage = async (props: IProps) => {
  const { slug } = props

  const product = await api.products({ slug }).get()
  return <div>{product.name}</div>
}

export default ProductDetailPage
```

For components without props:

```typescript
const ProductsPage = () => {
  return <div>Products</div>
}

export default ProductsPage
```

2.4 PROPS & INTERFACES

Rule: Always use Interface with prefix `I`

```typescript
// ✅ Component props - use IProps when component is only one in file
interface IProps {
  product: TProduct;
  onAddToCart?: (id: string) => void;
}

// ✅ Exported props - use descriptive name with Props suffix
export interface IProductCardProps {
  product: TProduct;
  variant?: "compact" | "detailed";
}

// ✅ Shared interfaces - prefix I
export interface IOption {
  label: string;
  value: string | number;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
}
```

IMPORTANT: Always destructure props inside the function body, NOT in the parameter.

Bad (❌):
const ProductCard = ({ product, onAddToCart }: IProps) => { ... }

Good (✅):
const ProductCard = (props: IProps) => {
const { product, onAddToCart } = props
...
}

2.5 TYPE ALIASES

Rule: Always use Type with prefix `T`

Use Type Alias (not Interface) for:

- Union types
- Utility types
- Response types
- Generic types
- Function types
- Entity types

```typescript
// ✅ Union types
export type TBrewMethod = "v60" | "espresso" | "aeropress" | "french-press";
export type TProductStatus = "active" | "inactive" | "draft";
export type TLayout = "horizontal" | "vertical";

// ✅ Generic utility types
export type TNullable<T> = T | null;
export type TOptional<T> = T | undefined;
export type TApiResponse<T> = {
  data: T;
  error?: string;
  status: number;
};

// ✅ Paginated responses
export type TPaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

// ✅ Entity types
export type TProduct = {
  id: string;
  name: string;
  price: number;
  shopId: string;
};

export type TProductVariant = {
  id: string;
  productId: string;
  weight: number;
  price: number;
};

// ✅ State types
export type TCartState = {
  items: TCartItem[];
  total: number;
};

// ✅ Function types
export type TOnSubmit = (data: FormData) => void;
export type TValidator<T> = (value: T) => boolean;
```

When to use Type vs Interface:

Use Interface (I) for:

- Props definitions
- DTOs from backend
- Object structures that may be extended

Use Type (T) for:

- Unions
- Generics
- Response wrappers
- Primitives
- Function signatures
- Entity types

  2.6 CUSTOM HOOKS

Naming Rules:

- Hook function: useCamelCase
- Hook file: kebab-case
- Return type: TUseXxxReturn (Type, not Interface)

```typescript
// File: use-products.ts

export type TUseProductsReturn = {
  products: TProduct[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useProducts(): TUseProductsReturn {
  // implementation
}
```

Examples:

```
useProducts()       → use-products.ts
useCart()           → use-cart.ts
useProductDetail()  → use-product-detail.ts
useAuth()           → use-auth.ts
useBrewLog()        → use-brew-log.ts
```

2.7 ZUSTAND STORES

Naming Rules:

- File name: `xxx.store.ts`
- Hook export: `useXxxStore`
- State type: `TXxxState`

```typescript
// File: cart.store.ts

import { create } from "zustand";

export type TCartItem = {
  productId: string;
  quantity: number;
  price: number;
};

export type TCartState = {
  items: TCartItem[];
  addItem: (item: TCartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

export const useCartStore = create<TCartState>(set => ({
  items: [],
  addItem: item =>
    set(state => ({
      items: [...state.items, item],
    })),
  removeItem: id =>
    set(state => ({
      items: state.items.filter(i => i.productId !== id),
    })),
  clear: () => set({ items: [] }),
}));
```

Examples:

```
cart.store.ts    → useCartStore
auth.store.ts    → useAuthStore
ui.store.ts      → useUiStore
```

2.8 SERVICE LAYER (API)

Naming Rules:

- File name: `xxx.service.ts`
- Functions: camelCase
- Response types: `TXxxResponse`

```typescript
// File: products.service.ts

import { api } from "@/lib/eden";

export type TProductsResponse = {
  products: TProduct[];
  total: number;
};

export type TProductDetailResponse = {
  product: TProduct;
  variants: TProductVariant[];
};

export async function getProducts(): Promise<TProductsResponse> {
  const { data } = await api.products.get();
  return data;
}

export async function getProductDetail(slug: string): Promise<TProductDetailResponse> {
  const { data } = await api.products({ slug }).get();
  return data;
}

export async function createProduct(input: TCreateProductInput): Promise<TProduct> {
  const { data } = await api.products.post(input);
  return data;
}
```

Examples:

```
products.service.ts  → getProducts(), getProductDetail()
shops.service.ts     → getShops(), getShopDetail()
cart.service.ts      → addToCart(), removeFromCart()
auth.service.ts      → login(), register(), logout()
```

2.9 VARIABLES & CONSTANTS

Variables: camelCase
Constants: UPPER_SNAKE_CASE

```typescript
// ✅ Variables
const productList = [];
const brewSteps = [];
const isLoading = false;
const selectedVariant = null;

// ✅ Constants
const DEFAULT_PAGE_SIZE = 20;
const MAX_CART_ITEMS = 100;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const BREW_METHODS = ["v60", "espresso", "aeropress"] as const;

// ✅ Prefer const objects over enums
export const PRODUCT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DRAFT: "draft",
} as const;

export type TProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];
```

2.10 CSS & TAILWIND CLASSES

Rules:

- Prefer Tailwind utilities
- Custom classes: kebab-case
- Use `cn()` helper for conditional classes

```typescript
// ✅ Good - Tailwind utilities
<div className="flex flex-col gap-4 p-6 rounded-lg border shadow-sm">

// ✅ Good - Custom class (rare)
<div className="brew-section-title">

// ✅ Good - Conditional with cn()
import { cn } from '@/lib/utils'

<div className={cn(
  "flex gap-2",
  layout === "horizontal" ? "flex-row items-start" : "flex-col"
)}>
```

Custom class examples (use sparingly):

```
brew-section-title
brew-card
brew-grid
product-badge
```

2.11 QUICK REFERENCE

```typescript
// Files & Folders
kebab-case                    → product-card.tsx, use-products.ts

// Components
PascalCase                    → ProductCard, ShopCard
export default ComponentName

// Props
interface IProps              → Component props (internal)
interface IProductCardProps   → Exported props
interface IOption             → Shared interfaces

// Types
type TProduct                 → Entity types
type TBrewMethod              → Union types
type TNullable<T>             → Generic utilities
type TApiResponse<T>          → Response wrappers

// Hooks
useCamelCase                  → useProducts, useCart
file: kebab-case              → use-products.ts
return: TUseXxxReturn         → TUseProductsReturn

// Stores
xxx.store.ts                  → cart.store.ts
useXxxStore                   → useCartStore
type TXxxState                → TCartState

// Services
xxx.service.ts                → products.service.ts
camelCase functions           → getProducts, createProduct
type TXxxResponse             → TProductsResponse

// Variables
camelCase                     → productList, isLoading
UPPER_SNAKE_CASE              → DEFAULT_PAGE_SIZE, API_URL

// CSS
kebab-case                    → brew-card, product-badge
Use Tailwind utilities first

// API
RESTful naming                → api.products.get()

// Commits
Conventional Commits          → feat:, fix:, refactor:
```

2.12 IMPORTANT RULES TO REMEMBER

1. **One component per file** - No exceptions
2. **Props destructuring inside function body** - Not in parameters
3. **Interface (I) for props and objects** - Type (T) for everything else
4. **kebab-case for all files** - PascalCase for component names only
5. **Use const Component pattern** - Not function declaration
6. **Export default at bottom** - After component definition

# ================================================== 3. COMPONENT STYLE RULES

3.1 One component per file

Hard rule:

- Do NOT define multiple UI components in the same file.
- Do NOT declare small sub-components inside the same file.

Bad:

// ❌ AVOID
const TableHeader = () => {...}
const TableRow = () => {...}

const Table = () => (
<>
<TableHeader />
<TableRow />
</>
)

export default Table

Good:

// features/table/components/table-header.tsx
const TableHeader = () => {...}
export default TableHeader

// features/table/components/table-row.tsx
const TableRow = () => {...}
export default TableRow

// features/table/components/table.tsx
import TableHeader from './table-header'
import TableRow from './table-row'

const Table = () => (

<div>
<TableHeader />
<TableRow />
</div>
)

export default Table

3.2 No inline sub-components

Avoid defining components inside other components:

Bad:

// ❌ AVOID
const ProductsPage = () => {
const Sub = () => <div>Sub</div>
return <Sub />
}

Good:

// features/products/components/sub.tsx
const Sub = () => <div>Sub</div>
export default Sub

// features/products/components/products-page.tsx
import Sub from './sub'

const ProductsPage = () => <Sub />
export default ProductsPage

# ================================================== 4. SEPARATION OF UI AND LOGIC

4.1 Use custom hooks for business logic and data fetching

- UI components should be mainly presentational.
- Data fetching, mutations, and complex logic should live in hooks under:
  features/<feature>/hooks/

Example:

// features/products/hooks/use-products.ts
import { api } from '@/lib/eden'

export type TUseProductsReturn = {
products: TProduct[]
isLoading: boolean
}

export function useProducts(): TUseProductsReturn {
// may use React Query, SWR, or custom state logic
// but this is the place for API calls & state for products
}

// features/products/components/products-page.tsx
'use client'

import { useProducts } from '../hooks/use-products'
import ProductCard from './product-card'

const ProductsPage = () => {
const { products, isLoading } = useProducts()

    if (isLoading) return <div>Loading...</div>

    return (
      <div>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    )

}

export default ProductsPage

Example with props:

// features/products/components/product-card.tsx
import type { TProduct } from '../types'

interface IProps {
product: TProduct
}

const ProductCard = (props: IProps) => {
const { product } = props

    return (
      <div>
        <h3>{product.name}</h3>
        <p>{product.price}</p>
      </div>
    )

}

export default ProductCard

4.2 Route files in app/ should be thin

- Example for app/(public)/products/page.tsx:

  import ProductsPage from '@/features/products/components/products-page'

  const Page = () => <ProductsPage />

  export default Page

No heavy logic in route files.

# ================================================== 5. NEXT.JS BEST PRACTICES

5.1 App Router fundamentals

- Use the App Router (app/ directory).
- Prefer Server Components by default.
- Mark Client Components explicitly with "use client" only when needed
  (e.g., forms, interactive components, Zustand usage, browser APIs).

  5.2 Server Components (default)

For data fetching in server components:

const Page = async () => {
const data = await api.products.get()
return (...)
}

export default Page

Benefits:

- Automatic data fetching at request time
- No client-side JavaScript for rendering
- Direct database/API access

  5.3 Client Components

Use "use client" when you need:

- Event handlers (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- React hooks (useState, useEffect, custom hooks)
- Zustand stores

Example:

'use client'

import { useState } from 'react'

const Counter = () => {
const [count, setCount] = useState(0)
return <button onClick={() => setCount(count + 1)}>{count}</button>
}

export default Counter

5.4 Data fetching patterns

Server Components (recommended for initial data):

const ProductsPage = async () => {
const products = await fetch('https://api.example.com/products')
return <ProductList products={products} />
}

Client Components (for interactive data):

'use client'

import { useProducts } from '../hooks/use-products'

const ProductsPage = () => {
const { products, isLoading } = useProducts()
// ...
}

5.5 Route organization

Use route groups for logical organization:

app/
(public)/ # Public routes (no auth required)
layout.tsx # Shared layout for public pages
page.tsx
products/
page.tsx
(auth)/ # Auth routes
layout.tsx # Shared layout for auth pages
login/
page.tsx
(dashboard)/ # Protected routes
layout.tsx # Shared layout + auth check
profile/
page.tsx

5.6 Loading and error states

Next.js provides special files for better UX:

app/
products/
loading.tsx # Shown while page.tsx is loading
error.tsx # Error boundary for this route
page.tsx

Example loading.tsx:

const Loading = () => {
return <div>Loading products...</div>
}

export default Loading

Example error.tsx:

'use client'

const Error = ({ error, reset }: { error: Error, reset: () => void }) => {
return (

<div>
<h2>Something went wrong!</h2>
<button onClick={reset}>Try again</button>
</div>
)
}

export default Error

5.7 Metadata API

Use Next.js metadata API for SEO:

import type { Metadata } from 'next'

export const metadata: Metadata = {
title: 'Products | BrewHub',
description: 'Browse our selection of premium coffee beans',
}

const ProductsPage = async () => {
// ...
}

For dynamic metadata:

export async function generateMetadata({ params }): Promise<Metadata> {
const product = await api.products({ slug: params.slug }).get()

    return {
      title: product.name,
      description: product.description,
    }

}

5.8 Image optimization

Use Next.js Image component:

import Image from 'next/image'

const ProductCard = ({ product }) => {
return (
<Image
        src={product.imageUrl}
        alt={product.name}
        width={300}
        height={300}
        className="object-cover"
      />
)
}

5.9 Environment variables

- Use NEXT*PUBLIC* prefix for client-side vars:

  # .env.local

  NEXT_PUBLIC_API_URL=https://api.brewhub.com
  DATABASE_URL=postgresql://... # Server-side only

- Access in code:

  // Server or client
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  // Server only
  const dbUrl = process.env.DATABASE_URL

# ================================================== 6. ZUSTAND USAGE

- One store per concern in /stores:

  stores/
  cart.store.ts // cart items, totals
  auth.store.ts // auth info (user, tokens if needed)
  ui.store.ts // UI flags, modals, etc.

- Stores should:
  - Be small and focused.
  - Not contain complex side-effects by default.
  - Expose actions for components/hooks to call.

Example:

// stores/cart.store.ts
import { create } from 'zustand'

type TCartItem = {...}

type TCartState = {
items: TCartItem[]
addItem: (item: TCartItem) => void
removeItem: (id: string) => void
clear: () => void
}

export const useCartStore = create<TCartState>((set) => ({
items: [],
addItem: (item) => set((state) => ({ items: [...state.items, item] })),
removeItem: (id) => set((state) => ({
items: state.items.filter((i) => i.id !== id),
})),
clear: () => set({ items: [] }),
}))

Components should select only needed slices:

'use client'

const items = useCartStore((s) => s.items)

Zustand persistence (optional):

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
persist<TCartState>(
(set) => ({
items: [],
addItem: (item) => set((state) => ({ items: [...state.items, item] })),
// ...
}),
{
name: 'cart-storage',
}
)
)

# ================================================== 7. SHADCN / UI / LUCIDE RULES

- All base UI primitives from shadcn go inside components/ui/.
- Do not modify shadcn primitives heavily; wrap them in feature or layout components if you need customization.
- Shared layout components (PageHeader, PageSection, etc.) go to components/layout/.
- Icons:
  - Import directly from lucide-react where needed:
    import { Coffee, ShoppingCart } from 'lucide-react'
  - Avoid creating a giant central icon registry unless necessary.

Example using shadcn Button:

import { Button } from '@/components/ui/button'

interface IProps {
onAddToCart: () => void
}

const ProductCard = (props: IProps) => {
const { onAddToCart } = props

    return (
      <Button variant="outline" size="sm" onClick={onAddToCart}>
        Add to Cart
      </Button>
    )

}

export default ProductCard

# ================================================== 8. EDEN TREATY CLIENT USAGE

- Define Eden Treaty client in lib/eden.ts using TApp type from the API:

  import { treaty } from '@elysiajs/eden'
  import type { TApp } from '@brewhub/api-types' // or equivalent shared types

  export const api = treaty<TApp>(
  process.env.NEXT_PUBLIC_API_URL!
  ).api

- Use `api` for type-safe calls instead of raw fetch.
- Do not hardcode endpoint paths; rely on Eden's inferred typings and auto-complete.

Example usage:

// Server Component
const ProductsPage = async () => {
const { data } = await api.products.get()
return <ProductList products={data} />
}

export default ProductsPage

// Client Component (via hook)
'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/eden'
import type { TProduct } from '@/features/products/types'

export type TUseProductsReturn = {
products: TProduct[]
}

export function useProducts(): TUseProductsReturn {
const [products, setProducts] = useState<TProduct[]>([])

    useEffect(() => {
      api.products.get().then(({ data }) => setProducts(data))
    }, [])

    return { products }

}

API naming conventions (RESTful):

// ✅ Good
api.products.get()
api.products.post()
api.products({ id: "123" }).get()
api.products({ id: "123" }).patch()
api.products({ id: "123" }).delete()

api.shops.get()
api.shops({ slug: "shop-name" }).get()
api.shops({ slug: "shop-name" }).products.get()

api.cart.items.get()
api.cart.items.post()
api.cart.items({ id: "123" }).delete()

api.auth.login.post()
api.auth.register.post()
api.auth.logout.post()

Backend should follow RESTful conventions:

```
GET    /products
GET    /products/:id
POST   /products
PATCH  /products/:id
DELETE /products/:id

GET    /shops
GET    /shops/:slug
GET    /shops/:slug/products
```

# ================================================== 9. TAILWIND CSS V4 BEST PRACTICES

9.1 Use utility classes directly

- Prefer Tailwind utilities over custom CSS.
- Use consistent spacing scale (p-4, mt-2, gap-6, etc.).

Example:

const ProductCard = () => {
return (

<div className="rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
<h3 className="text-lg font-semibold">Product Name</h3>
<p className="text-sm text-gray-600 mt-2">Description</p>
</div>
)
}

9.2 Responsive design

Use Tailwind's responsive prefixes:

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

9.3 Component variants with cn utility

Install and use cn helper:

// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
return twMerge(clsx(inputs))
}

Usage:

import { cn } from '@/lib/utils'

interface IProps {
className?: string
variant: 'primary' | 'secondary'
}

const Button = (props: IProps) => {
const { className, variant } = props

    return (
      <button
        className={cn(
          "px-4 py-2 rounded",
          variant === "primary" && "bg-blue-500 text-white",
          variant === "secondary" && "bg-gray-200 text-gray-800",
          className
        )}
      >
        Click me
      </button>
    )

}

export default Button

# ================================================== 10. FILE LENGTH & CLEANLINESS

- Aim for files under ~200 lines where reasonable.
- If a component or hook grows too large, split into smaller ones.
- Avoid "god components" or "god hooks".
- Use clear, descriptive names (products-page, shop-card, brew-log-form, etc.).
- Prefer readability over clever tricks.

# ================================================== 11. COMMIT MESSAGE RULES

Use the same simplified Conventional Commit style as the API:

Allowed prefixes:

- init: initial setup
- feat: new feature
- fix: bug fix
- refactor: code restructuring without behavior change
- chore: config/tooling/dependency updates
- docs: documentation only
- style: purely visual/UI changes (no behavior changes)
- test: tests only

Examples:

- init: setup next.js app router structure
- feat: add products page with shop filter
- feat: implement cart store with zustand
- fix: correct product variant selection logic
- style: refine spacing on product card
- refactor: split journal page into smaller components

Guidelines:

- Subject line ~80–90 characters max.
- Use imperative, present tense ("add", "fix", "implement").
- Each commit should represent one logical change (avoid huge mixed commits).

# ================================================== 12. GENERAL PRINCIPLES

- Respect the owner's preferences:
  - const Component + export default
  - One component per file
  - No inline sub components
  - Logic in hooks, UI in components
  - kebab-case for ALL files
  - PascalCase for component names
  - Interface (I) for props, Type (T) for everything else
- Keep things simple, and avoid premature abstractions.
- Always think about future readability and maintainability.
- When in doubt, choose clarity over cleverness.
- Security first: validate inputs, prevent XSS, SQL injection.
- Performance matters, but readability matters more.
- Write self-documenting code; add comments only when necessary to explain "why".

# ================================================== 13. TESTING (FUTURE)

When implementing tests:

- Use Vitest or Jest for unit tests
- Use Playwright or Cypress for E2E tests
- Test files should live next to the component: product-card.test.tsx
- Focus on testing behavior, not implementation details

File Naming:

```
product-card.test.tsx
use-products.test.ts
cart.store.test.ts
```

Test Functions:

```typescript
describe('ProductCard', () => {
  it('should render product name', () => { ... })
  it('should call onAddToCart when button clicked', () => { ... })
})

describe('useProducts', () => {
  it('should fetch products on mount', () => { ... })
  it('should handle errors', () => { ... })
})
```

==================================================
END OF CLAUDE GUIDELINES
==================================================
