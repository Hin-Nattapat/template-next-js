# Create New Component

Use this prompt when creating a new component in the BrewHub project.

## Requirements

1. Component declaration style:
   - Use `const ComponentName = () => { ... }`
   - Export default at the bottom: `export default ComponentName`

2. Props typing:
   - Use `interface IProps` for component props
   - Interface names start with `I`
   - Type names start with `T`

3. File organization:
   - One component per file
   - No inline sub-components
   - No multiple components in the same file

4. Location:
   - Feature components go in: `features/<feature>/components/`
   - Shared layout components go in: `components/layout/`
   - UI primitives (shadcn) go in: `components/ui/`

5. Client vs Server:
   - Server Component by default (no "use client")
   - Add "use client" only when needed:
     - Event handlers
     - Browser APIs
     - React hooks (useState, useEffect)
     - Zustand stores

## Template

```typescript
// For Client Component
'use client'

import { ComponentType } from 'package-name'

interface IProps {
  prop1: string
  prop2?: number
}

const ComponentName = (props: IProps) => {
  const { prop1, prop2 } = props

  return (
    <div>
      {/* Component content */}
    </div>
  )
}

export default ComponentName
```

```typescript
// For Server Component (default)
import { ComponentType } from 'package-name'

interface IProps {
  prop1: string
  prop2?: number
}

const ComponentName = (props: IProps) => {
  const { prop1, prop2 } = props

  return (
    <div>
      {/* Component content */}
    </div>
  )
}

export default ComponentName
```

```typescript
// For Component without props
const ComponentName = () => {
  return (
    <div>
      {/* Component content */}
    </div>
  )
}

export default ComponentName
```

## Example

User request: "Create a ProductCard component"

Location: `features/products/components/ProductCard.tsx`

```typescript
import Image from 'next/image'
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
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={300}
        height={300}
        className="object-cover rounded"
      />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <p className="text-sm text-gray-600 mt-1">{product.description}</p>
      <div className="flex items-center justify-between mt-4">
        <span className="text-xl font-bold">${product.price}</span>
        <Button onClick={() => onAddToCart?.(product)}>
          Add to Cart
        </Button>
      </div>
    </div>
  )
}

export default ProductCard
```

## Component with Multiple Props (Named Interface)

For more complex components, you can use a named interface:

```typescript
import type { TProduct } from '../types'

interface IProductCardProps {
  product: TProduct
  variant?: 'default' | 'compact'
  showActions?: boolean
  onAddToCart?: (product: TProduct) => void
  onViewDetails?: (product: TProduct) => void
}

const ProductCard = (props: IProductCardProps) => {
  const {
    product,
    variant = 'default',
    showActions = true,
    onAddToCart,
    onViewDetails
  } = props

  return (
    <div className={variant === 'compact' ? 'p-2' : 'p-4'}>
      {/* Component content */}
    </div>
  )
}

export default ProductCard
```

## IMPORTANT Rules

1. **Props Destructuring**: ALWAYS destructure props inside the function body

   ❌ Bad:

   ```typescript
   const Component = ({ prop1, prop2 }: IProps) => { ... }
   ```

   ✅ Good:

   ```typescript
   const Component = (props: IProps) => {
     const { prop1, prop2 } = props
     ...
   }
   ```

2. **Interface Naming**:
   - Use simple `IProps` for single-purpose components
   - Use descriptive names like `IProductCardProps` when exporting or reusing

3. **Type Prefixes**:
   - Interfaces: `I` prefix (IProps, IUser, IProductCardProps)
   - Types: `T` prefix (TProduct, TCartState, TVariant)
