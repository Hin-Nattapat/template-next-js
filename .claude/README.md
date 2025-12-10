# BrewHub Web - Claude Configuration

This directory contains configuration and guidelines for AI assistants working on the BrewHub Web project.

## Files Overview

### Main Configuration

- **[claude.md](claude.md)** - Main configuration file with comprehensive coding standards, architecture guidelines, and best practices for the BrewHub project.

### Prompt Templates

Located in the `prompts/` directory:

- **[component.md](prompts/component.md)** - Guidelines for creating new React components
- **[hook.md](prompts/hook.md)** - Guidelines for creating custom hooks
- **[feature.md](prompts/feature.md)** - Guidelines for creating new feature modules
- **[store.md](prompts/store.md)** - Guidelines for creating Zustand stores

### AI Agents

Located in the `agents/` directory:

- **[component-builder.md](agents/component-builder.md)** - Specialized agent for building React components
- **[hook-builder.md](agents/hook-builder.md)** - Specialized agent for creating custom hooks
- **[feature-architect.md](agents/feature-architect.md)** - Specialized agent for architecting complete features
- **[code-reviewer.md](agents/code-reviewer.md)** - Specialized agent for code review

See [agents/README.md](agents/README.md) for detailed usage instructions.

### Other Files

- **[ignore](ignore)** - Files and directories to ignore when working with Claude

## Key Principles

### Component Style

- Use `const ComponentName = () => { ... }` pattern
- Export default at the bottom
- One component per file
- No inline sub-components

### Type Naming Convention

- **Interfaces**: Prefix with `I` (e.g., `IProps`, `IProductCardProps`)
- **Types**: Prefix with `T` (e.g., `TProduct`, `TCartState`)

### Props Typing

Always use interface for component props and destructure inside function body:

```typescript
interface IProps {
  product: TProduct;
  onAddToCart?: (product: TProduct) => void;
}

const ProductCard = (props: IProps) => {
  const { product, onAddToCart } = props;
  // ...
};
```

**IMPORTANT**: Never destructure props in the parameter - always do it inside the function body!

### Project Structure

```
app/                  # Next.js App Router
features/             # Feature modules
  <feature>/
    components/       # UI components
    hooks/           # Business logic hooks
    types/           # Type definitions
components/
  ui/                # shadcn primitives
  layout/            # Shared layout components
stores/              # Zustand stores
lib/                 # Utilities and configs
```

## Quick Reference

### Creating Components

1. Use `interface IProps` for props
2. Mark client components with "use client"
3. Server components by default
4. One component per file

### Creating Hooks

1. Start with `use` prefix
2. Put logic in hooks, not components
3. Return objects for multiple values
4. Use proper TypeScript types

### Creating Features

1. Create directory under `features/`
2. Define types with T/I prefixes
3. Create hooks for logic
4. Create components for UI
5. Thin route wrappers in `app/`

## Technologies

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **State Management**: Zustand
- **API Client**: Eden Treaty

## Commit Convention

Use conventional commits with these prefixes:

- `init:` - Initial setup
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code restructuring
- `chore:` - Config/tooling updates
- `docs:` - Documentation
- `style:` - Visual/UI changes
- `test:` - Tests

## Need Help?

Refer to [claude.md](claude.md) for detailed guidelines on all aspects of the project.
