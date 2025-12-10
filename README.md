# BrewHub Web

> A modern e-commerce platform for coffee enthusiasts to discover, purchase, and journal their coffee experiences.

**Tech Stack**: Next.js 16 • TypeScript • Tailwind CSS v4 • shadcn/ui • Zustand • Eden Treaty API

---

## Table of Contents

- [Getting Started](#getting-started)
- [Project Overview](#project-overview)
- [Naming Conventions](#naming-conventions)
  - [Files & Folders](#files--folders)
  - [React Components](#react-components)
  - [Props & Interfaces](#props--interfaces)
  - [Types](#types)
  - [Custom Hooks](#custom-hooks)
  - [Zustand Stores](#zustand-stores)
  - [Service Layer](#service-layer)
  - [Variables & Constants](#variables--constants)
  - [CSS & Styling](#css--styling)
  - [API Conventions](#api-conventions)
  - [Commit Messages](#commit-messages)
- [Quick Reference](#quick-reference)
- [Contributing](#contributing)

---

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm/yarn/pnpm/bun

### Installation

```bash
# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Run development server
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## Project Overview

BrewHub is a full-stack e-commerce platform focused on coffee beans with these core features:

- **Multi-shop marketplace** - Browse products from different coffee roasters
- **Product variants** - Different sizes and weights for products
- **Shopping cart** - Add to cart, manage quantities
- **Coffee journal (BrewLog)** - Track brewing methods and tasting notes
- **My Beans** - Personal coffee collection management (future)

### Architecture Principles

- **Component-driven** - Small, focused, reusable components
- **Feature-based** - Organized by feature, not technical role
- **Separation of concerns** - UI in components, logic in hooks
- **Type-safe API** - Eden Treaty for end-to-end type safety
- **Clean & simple** - No over-engineering, readable code first

---

## Naming Conventions

> **IMPORTANT**: All contributors must follow these naming conventions strictly to maintain consistency across the codebase.

### Files & Folders

#### Rule: Always use `kebab-case` for files and folders

```
✅ Good
product-card.tsx
use-products.ts
cart.store.ts
products.service.ts
app-form-label.tsx

❌ Bad
ProductCard.tsx
useProducts.ts
cartStore.ts
```

#### Folder Structure

```
app/                   → Next.js App Router pages
  (public)/            → Public routes (no auth)
  (auth)/              → Auth routes (login, register)

components/
  ui/                  → shadcn primitives only
  common/              → BrewHub-specific reusable components
  form/                → Form-specific components
  layout/              → Layout components
  product/             → Product-specific UI

features/
  products/
    components/        → Feature UI components
    hooks/             → Business logic
    services/          → API communication
    types/             → Feature-specific types

stores/                → Zustand state management
  cart.store.ts
  auth.store.ts

types/                 → Global type definitions
  global.ts
  api.ts

lib/                   → Utilities and configurations
  eden.ts              → API client
  utils.ts             → Helper functions
```

---

### React Components

#### Component Naming

- **Component name**: `PascalCase`
- **File name**: `kebab-case`
- **One component per file** (strict rule - no exceptions)

#### Component Declaration Style

We follow a **consistent pattern** for all components:

```typescript
// ✅ CORRECT - Always use this pattern
interface IProps {
  title: string
  description?: string
}

const ProductCard = (props: IProps) => {
  const { title, description } = props

  return (
    <div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  )
}

export default ProductCard
```

```typescript
// ❌ INCORRECT - Don't use this
export default function ProductCard({ title }: IProps) {
  return <div>{title}</div>
}
```

#### Key Rules

1. Define component as `const ComponentName`
2. Accept `props: IProps` as parameter
3. Destructure props **inside** function body (NOT in parameters)
4. Use `export default ComponentName` at the bottom

#### For Components Without Props

```typescript
const ProductsPage = () => {
  return <div>Products</div>
}

export default ProductsPage
```

#### For Async Server Components

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

#### Why This Pattern?

- **Consistency**: Every component follows the same structure
- **Readability**: Clear separation of props definition and usage
- **Refactoring**: Easy to add/remove props without touching parameters
- **Team standard**: Matches project owner's preferred style

---

### Props & Interfaces

#### Rule: Use `Interface` with prefix `I`

Props should always be defined as interfaces with the `I` prefix.

#### Simple Props (Internal Use)

```typescript
interface IProps {
  product: TProduct;
  onAddToCart?: (id: string) => void;
}
```

#### Exported Props (Shared Components)

```typescript
export interface IProductCardProps {
  product: TProduct;
  variant?: "compact" | "detailed";
  className?: string;
}
```

#### Shared Interfaces

```typescript
export interface IOption {
  label: string;
  value: string | number;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer";
}

export interface IPaginationParams {
  page: number;
  pageSize: number;
  sort?: string;
  order?: "asc" | "desc";
}
```

---

### Types

#### Rule: Use `Type` with prefix `T`

Type aliases are used for unions, utilities, generics, and entity types.

#### Union Types

```typescript
export type TBrewMethod = "v60" | "espresso" | "aeropress" | "french-press";
export type TProductStatus = "active" | "inactive" | "draft";
export type TLayout = "horizontal" | "vertical";
export type TOrderStatus = "pending" | "processing" | "completed" | "cancelled";
```

#### Generic Utility Types

```typescript
export type TNullable<T> = T | null;
export type TOptional<T> = T | undefined;
export type TPartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

#### API Response Types

```typescript
export type TApiResponse<T> = {
  data: T;
  error?: string;
  status: number;
};

export type TPaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
};
```

#### Entity Types

```typescript
export type TProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  shopId: string;
  status: TProductStatus;
  createdAt: string;
  updatedAt: string;
};

export type TProductVariant = {
  id: string;
  productId: string;
  weight: number;
  price: number;
  stock: number;
};

export type TCartItem = {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
};
```

#### Function Types

```typescript
export type TOnSubmit<T> = (data: T) => void | Promise<void>;
export type TValidator<T> = (value: T) => boolean;
export type TFormatter<T> = (value: T) => string;
```

#### When to Use Type vs Interface

| Use Interface (`I`)               | Use Type (`T`)        |
| --------------------------------- | --------------------- |
| Props definitions                 | Union types           |
| DTOs from backend                 | Generic utilities     |
| Object structures that may extend | API response wrappers |
| Shared object shapes              | Entity types          |
|                                   | Function signatures   |
|                                   | Computed/mapped types |

---

### Custom Hooks

#### Naming Rules

- **Hook function**: `useCamelCase`
- **Hook file**: `kebab-case`
- **Return type**: `TUseXxxReturn`

#### Examples

```typescript
// File: use-products.ts

export type TUseProductsReturn = {
  products: TProduct[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useProducts(): TUseProductsReturn {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Implementation...

  return { products, isLoading, error, refetch };
}
```

#### Common Hook Patterns

```
useProducts()       → use-products.ts
useCart()           → use-cart.ts
useProductDetail()  → use-product-detail.ts
useAuth()           → use-auth.ts
useBrewLog()        → use-brew-log.ts
useProductFilters() → use-product-filters.ts
```

---

### Zustand Stores

#### Naming Rules

- **File name**: `xxx.store.ts`
- **Hook export**: `useXxxStore`
- **State type**: `TXxxState`

#### Example

```typescript
// File: cart.store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TCartItem = {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
};

export type TCartState = {
  items: TCartItem[];
  addItem: (item: TCartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  getTotal: () => number;
};

export const useCartStore = create<TCartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: item =>
        set(state => ({
          items: [...state.items, item],
        })),

      removeItem: productId =>
        set(state => ({
          items: state.items.filter(i => i.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set(state => ({
          items: state.items.map(i =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        })),

      clear: () => set({ items: [] }),

      getTotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);
```

#### Store Examples

```
cart.store.ts    → useCartStore
auth.store.ts    → useAuthStore
ui.store.ts      → useUiStore
filters.store.ts → useFiltersStore
```

---

### Service Layer

#### Naming Rules

- **File name**: `xxx.service.ts`
- **Functions**: `camelCase`
- **Response types**: `TXxxResponse`

#### Example

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
  relatedProducts: TProduct[];
};

export type TCreateProductInput = {
  name: string;
  description: string;
  price: number;
  shopId: string;
};

export async function getProducts(
  params?: IPaginationParams,
): Promise<TProductsResponse> {
  const { data } = await api.products.get({ query: params });
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

export async function updateProduct(
  id: string,
  input: Partial<TCreateProductInput>,
): Promise<TProduct> {
  const { data } = await api.products({ id }).patch(input);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.products({ id }).delete();
}
```

#### Service Examples

```
products.service.ts → getProducts(), getProductDetail(), createProduct()
shops.service.ts    → getShops(), getShopDetail(), getShopProducts()
cart.service.ts     → addToCart(), removeFromCart(), checkout()
auth.service.ts     → login(), register(), logout(), refreshToken()
journal.service.ts  → getBrewLogs(), createBrewLog(), updateBrewLog()
```

---

### Variables & Constants

#### Variables: `camelCase`

```typescript
const productList = [];
const brewSteps = [];
const isLoading = false;
const selectedVariant = null;
const currentUser = null;
```

#### Constants: `UPPER_SNAKE_CASE`

```typescript
const DEFAULT_PAGE_SIZE = 20;
const MAX_CART_ITEMS = 100;
const MIN_PASSWORD_LENGTH = 8;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes
```

#### Constant Objects

```typescript
export const PRODUCT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DRAFT: "draft",
} as const;

export const BREW_METHODS = {
  V60: "v60",
  ESPRESSO: "espresso",
  AEROPRESS: "aeropress",
  FRENCH_PRESS: "french-press",
} as const;

export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (slug: string) => `/product/${slug}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
} as const;
```

---

### CSS & Styling

#### Tailwind Utilities (Preferred)

Use Tailwind utility classes whenever possible:

```tsx
<div className="flex flex-col gap-4 rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md">
  <h3 className="text-lg font-semibold text-gray-900">Product Name</h3>
  <p className="text-sm text-gray-600">Description</p>
</div>
```

#### Custom Classes (Rare)

Use `kebab-case` for custom classes:

```css
.brew-section-title {
}
.brew-card {
}
.product-badge {
}
```

#### Conditional Classes with `cn()`

```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  "flex gap-2",
  layout === "horizontal" ? "flex-row items-start" : "flex-col",
  isActive && "bg-blue-50 border-blue-200",
  className
)}>
```

---

### API Conventions

#### Eden Treaty Usage

Eden Treaty provides type-safe API calls:

```typescript
// List resources
await api.products.get()
await api.shops.get()

// Get single resource
await api.products({ id: "123" }).get()
await api.shops({ slug: "shop-name" }).get()

// Nested resources
await api.shops({ slug: "shop-name" }).products.get()

// Create
await api.products.post({ name: "...", price: 100 })

// Update
await api.products({ id: "123" }).patch({ price: 120 })

// Delete
await api.products({ id: "123" }).delete()

// Authentication
await api.auth.login.post({ email: "...", password: "..." })
await api.auth.register.post({ ... })
await api.auth.logout.post()
```

#### RESTful Backend Conventions

Backend should follow these patterns:

```
GET    /products
GET    /products/:id
POST   /products
PATCH  /products/:id
DELETE /products/:id

GET    /shops
GET    /shops/:slug
GET    /shops/:slug/products

GET    /cart/items
POST   /cart/items
DELETE /cart/items/:id

POST   /auth/login
POST   /auth/register
POST   /auth/logout
```

---

### Commit Messages

#### Format: Conventional Commits

Use the format: `<type>: <description>`

#### Allowed Types

- `init` - Initial setup
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code restructuring (no behavior change)
- `style` - Visual/UI changes only
- `chore` - Config, dependencies, tooling
- `docs` - Documentation only
- `test` - Tests only

#### Examples

```bash
✅ Good
feat: add product card component
feat: implement cart store with zustand
fix: correct price formatting in product detail
fix: resolve authentication token expiration issue
refactor: split journal page into smaller components
style: improve spacing in product list
chore: update eslint config
docs: update naming convention guide
test: add unit tests for useProducts hook

❌ Bad
Added product card
Fixed bug
Update
WIP
asdf
```

#### Guidelines

- Keep subject line under 90 characters
- Use imperative, present tense: "add" not "added"
- Be specific and descriptive
- One logical change per commit
- Don't combine multiple unrelated changes

---

## Quick Reference

### File & Folder Naming

```
kebab-case → product-card.tsx, use-products.ts, cart.store.ts
```

### Components

```typescript
PascalCase                    → ProductCard, ShopCard
File: kebab-case              → product-card.tsx
Export: default               → export default ProductCard
Pattern: const + props destruct inside body
```

### Props & Interfaces

```typescript
interface IProps              → Internal props
interface IProductCardProps   → Exported props
interface IOption             → Shared interfaces
interface IUser               → Entity interfaces
```

### Types

```typescript
type TProduct                 → Entity types
type TBrewMethod              → Union types
type TNullable<T>             → Generic utilities
type TApiResponse<T>          → Response wrappers
type TUseProductsReturn       → Hook return types
```

### Hooks

```typescript
useCamelCase                  → useProducts, useCart
File: kebab-case              → use-products.ts
Return: TUseXxxReturn         → TUseProductsReturn
```

### Stores

```typescript
File: xxx.store.ts            → cart.store.ts
Hook: useXxxStore             → useCartStore
State: TXxxState              → TCartState
```

### Services

```typescript
File: xxx.service.ts          → products.service.ts
Functions: camelCase          → getProducts, createProduct
Response: TXxxResponse        → TProductsResponse
```

### Variables & Constants

```typescript
camelCase                     → productList, isLoading
UPPER_SNAKE_CASE              → DEFAULT_PAGE_SIZE, API_URL
```

### CSS & Styling

```typescript
Prefer: Tailwind utilities    → className="flex gap-4"
Custom: kebab-case            → brew-card, product-badge
Conditional: cn()             → cn("base", condition && "extra")
```

### Commits

```
Conventional Commits          → feat:, fix:, refactor:, style:
```

---

## Contributing

When contributing to BrewHub:

1. **Read this guide thoroughly** - Especially the naming conventions
2. **Follow all conventions strictly** - Consistency is key
3. **Write self-documenting code** - Clear names, simple logic
4. **Keep components small** - One responsibility per component
5. **Separate UI from logic** - Components for UI, hooks for logic
6. **Write meaningful commits** - Follow Conventional Commits
7. **Test before committing** - Ensure code works as expected

### Code Review Checklist

Before submitting a PR, verify:

- [ ] All files use `kebab-case` naming
- [ ] Components follow `const ComponentName` pattern
- [ ] Props destructured inside function body
- [ ] Interfaces use `I` prefix, Types use `T` prefix
- [ ] One component per file (no exceptions)
- [ ] Custom hooks use `useCamelCase` naming
- [ ] Services/stores follow naming patterns
- [ ] Commit messages follow Conventional Commits
- [ ] Code is self-documenting with clear names
- [ ] No over-engineering or premature abstractions

### Questions or Suggestions?

If you have questions about conventions or suggestions for improvements:

1. Open an issue in the repository
2. Discuss in team meetings
3. Propose changes via pull request

Remember: **Consistency is key**. Following these conventions makes the codebase easier to navigate, understand, and maintain for everyone.

---

## Learn More

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Next.js GitHub](https://github.com/vercel/next.js) - Feedback and contributions welcome

### Project Resources

- [CLAUDE.md](.claude/CLAUDE.md) - Detailed project guidelines for AI assistants
- [NAMING_CONVENTION.md](NAMING_CONVENTION.md) - Standalone naming convention guide

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

**Last Updated**: December 2025
**Maintained By**: BrewHub Development Team
**License**: MIT (or your chosen license)
