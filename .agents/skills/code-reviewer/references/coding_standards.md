# Coding Standards

Language-specific coding standards and conventions for code review.

---

## Table of Contents

- [Universal Principles](#universal-principles)
- [TypeScript Standards](#typescript-standards)

---

## Universal Principles

These apply across all languages.

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Variables | camelCase (JS/TS), snake_case (Python/Go) | `userName`, `user_name` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Functions | camelCase (JS/TS), snake_case (Python) | `getUserById`, `get_user_by_id` |
| Classes | PascalCase | `UserRepository` |
| Interfaces | PascalCase, optionally prefixed | `IUserService` or `UserService` |
| Private members | Prefix with underscore or use access modifiers | `_internalState` |

### Function Design

```
Good functions:
- Do one thing well
- Have descriptive names (verb + noun)
- Take 3 or fewer parameters
- Return early for error cases
- Stay under 50 lines
```

### Error Handling

```
Good error handling:
- Catch specific errors, not generic exceptions
- Log with context (what, where, why)
- Clean up resources in error paths
- Don't swallow errors silently
- Provide actionable error messages
```

---

## TypeScript Standards

### Type Annotations

```typescript
// Avoid 'any' - use unknown for truly unknown types
function processData(data: unknown): ProcessedResult {
  if (isValidData(data)) {
    return transform(data);
  }
  throw new Error('Invalid data format');
}

// Use explicit return types for public APIs
export function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Use type guards for runtime checks
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj
  );
}
```

### Null Safety

```typescript
// Use optional chaining and nullish coalescing
const userName = user?.profile?.name ?? 'Anonymous';

// Be explicit about nullable types
interface Config {
  timeout: number;
  retries?: number;  // Optional
  fallbackUrl: string | null;  // Explicitly nullable
}

// Use assertion functions for validation
function assertDefined<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error('Value is not defined');
  }
}
```

### Async/Await

```typescript
// Always handle errors in async functions
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user', { id, error });
    throw new UserFetchError(id, error);
  }
}

// Use Promise.all for parallel operations
async function loadDashboard(userId: string): Promise<Dashboard> {
  const [profile, stats, notifications] = await Promise.all([
    fetchProfile(userId),
    fetchStats(userId),
    fetchNotifications(userId)
  ]);
  return { profile, stats, notifications };
}
```

### React/Component Standards

```typescript
// Use explicit prop types
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// Prefer functional components with hooks
function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

// Use custom hooks for reusable logic
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

