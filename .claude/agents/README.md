# BrewHub AI Agents

This directory contains specialized AI agents for the BrewHub Web project. Each agent is focused on specific tasks and follows BrewHub's strict coding standards.

## Available Agents

### 1. [Component Builder](component-builder.md)

**Purpose**: Create React components following BrewHub's patterns

**Use when:**

- Creating new UI components
- Need to ensure proper props destructuring
- Building client or server components
- Setting up component structure

**Key Responsibilities:**

- Enforce props destructuring inside function body
- Use interface IProps pattern
- Follow const + export default style
- Ensure one component per file

### 2. [Hook Builder](hook-builder.md)

**Purpose**: Create custom React hooks for business logic

**Use when:**

- Building data fetching hooks
- Creating form hooks
- Setting up filter/search logic
- Managing complex state

**Key Responsibilities:**

- Proper hook patterns
- Type safety with T/I prefixes
- Return objects (not arrays)
- Handle loading and error states

### 3. [Feature Architect](feature-architect.md)

**Purpose**: Design and scaffold complete feature modules

**Use when:**

- Starting a new feature from scratch
- Need complete feature structure
- Want types, hooks, and components together
- Building complex features

**Key Responsibilities:**

- Create proper folder structure
- Define types first
- Build hooks for logic
- Create components for UI
- Set up routes

### 4. [Code Reviewer](code-reviewer.md)

**Purpose**: Review code for compliance with BrewHub standards

**Use when:**

- Before committing code
- After completing a feature
- Reviewing pull requests
- Ensuring code quality

**Key Responsibilities:**

- Check props destructuring pattern
- Verify type naming conventions
- Ensure proper file organization
- Review performance and best practices

## How to Use Agents

### For Component Creation

```
User: "Create a ProductCard component that displays product info"

Agent: component-builder
```

The component-builder agent will:

1. Ask for clarifications (client/server, props needed)
2. Create component with proper structure
3. Use interface IProps
4. Destructure props inside function body
5. Follow all BrewHub patterns

### For Hook Creation

```
User: "Create a hook to fetch and filter products"

Agent: hook-builder
```

The hook-builder agent will:

1. Create hook with proper naming
2. Use T/I type prefixes
3. Return object with descriptive keys
4. Handle loading and error states

### For Complete Feature

```
User: "Build a complete cart feature with add/remove/checkout"

Agent: feature-architect
```

The feature-architect agent will:

1. Create folder structure
2. Define types
3. Build hooks for cart operations
4. Create cart components
5. Set up routes

### For Code Review

```
User: "Review my ProductsPage component"

Agent: code-reviewer
```

The code-reviewer agent will:

1. Check props destructuring
2. Verify type naming
3. Review component structure
4. Suggest improvements

## Agent Naming Convention

All agents follow these rules:

- **Interface**: `I` prefix → `IProps`, `IProductCardProps`
- **Type**: `T` prefix → `TProduct`, `TCartState`
- **Props destructuring**: Always inside function body
- **Component style**: `const Component = (props: IProps) => { }`

## Quick Reference

| Task             | Agent             | Pattern                            |
| ---------------- | ----------------- | ---------------------------------- |
| Create component | component-builder | `const C = (props: IProps) => { }` |
| Create hook      | hook-builder      | `export function useHook() { }`    |
| Create feature   | feature-architect | Full folder structure              |
| Review code      | code-reviewer     | Checklist-based review             |

## Common Patterns

### Component Pattern

```typescript
interface IProps {
  product: TProduct
}

const ProductCard = (props: IProps) => {
  const { product } = props
  return <div>{product.name}</div>
}

export default ProductCard
```

### Hook Pattern

```typescript
export function useProducts() {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  return { products, isLoading };
}
```

### Type Pattern

```typescript
// Type for data
export type TProduct = {
  id: string;
  name: string;
};

// Interface for config/props
export interface IProductFilters {
  search: string;
  minPrice: number;
}
```

## Tips

1. **Choose the right agent**: Use specialized agents for specific tasks
2. **Follow the patterns**: Each agent enforces BrewHub standards
3. **Review your code**: Use code-reviewer before committing
4. **Ask for help**: Agents can clarify requirements

## Remember

All agents enforce:

- ✅ Props destructuring inside function body
- ✅ I prefix for interfaces
- ✅ T prefix for types
- ✅ One component per file
- ✅ const + export default style
- ✅ Clean, simple, maintainable code
