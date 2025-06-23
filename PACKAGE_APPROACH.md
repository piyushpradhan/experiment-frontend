# Package-Based Approach Implementation

This project now uses the **Package-Based Approach** for integrating separate apps into the host application. This is the enterprise standard for monorepos with multiple applications.

## Architecture Overview

```
apps/
├── host/                    # Main host application
│   ├── package.json        # Depends on @experiment/messaging-app and @experiment/collaboration-app
│   └── src/routes.tsx      # Imports apps as packages
├── messaging/              # Messaging application
│   ├── package.json        # Exports as @experiment/messaging-app
│   ├── vite.config.ts      # Builds to dist/ as library
│   └── src/App.tsx         # Main messaging component
└── collaboration/          # Collaboration application
    ├── package.json        # Exports as @experiment/collaboration-app
    ├── vite.config.js      # Builds to dist/ as library
    └── src/index.tsx       # Main collaboration component

packages/
├── design-system/          # Shared UI components
├── shared-components/      # Shared React components
└── shared-utils/           # Shared utility functions
```

## How It Works

### 1. App Configuration

Each app (messaging, collaboration) is configured as a package:

```json
// apps/messaging/package.json
{
  "name": "@experiment/messaging-app",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

### 2. Build Configuration

Each app builds to a `dist/` directory as a library:

```typescript
// apps/messaging/vite.config.ts
export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, 'src/App.tsx'),
      name: 'MessagingApp',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
})
```

### 3. Host App Integration

The host app imports the apps as packages:

```typescript
// apps/host/src/routes.tsx
const Messaging = lazy(() => import('@experiment/messaging-app'))
const Collaboration = lazy(() => import('@experiment/collaboration-app'))
```

### 4. Build Pipeline

Turbo ensures apps are built before the host app:

```json
// turbo.json
{
  "pipeline": {
    "host#build": {
      "dependsOn": ["messaging#build", "collaboration#build"]
    }
  }
}
```

## Benefits

✅ **Clear Boundaries**: Each app is a separate package with its own build process
✅ **Independent Development**: Teams can work on apps independently
✅ **Type Safety**: Full TypeScript support with proper type declarations
✅ **Version Control**: Each app can be versioned independently
✅ **Build Optimization**: Only rebuild what's changed
✅ **Enterprise Standard**: Used by major companies worldwide

## Usage

### Development

```bash
# Start all apps in development mode
pnpm dev

# Start specific app
pnpm --filter @experiment/messaging-app dev
```

### Building

```bash
# Build all apps
pnpm build

# Build specific apps
pnpm build:apps

# Build host app (depends on other apps being built)
pnpm build:host
```

### Adding New Apps

1. Create new app in `apps/`
2. Configure `package.json` with package name and exports
3. Configure `vite.config.ts` to build as library
4. Add to host app dependencies
5. Import in host app routes

## Comparison with Other Approaches

| Approach             | Pros                                              | Cons                               | Use Case                |
| -------------------- | ------------------------------------------------- | ---------------------------------- | ----------------------- |
| **Package-Based** ✅ | Clear boundaries, Type safety, Independent builds | Setup complexity                   | Enterprise, Large teams |
| Path Aliases ❌      | Simple setup                                      | Tight coupling, Build dependencies | Prototypes, Learning    |
| Module Federation    | Runtime integration, Independent deployment       | Complex setup, Runtime overhead    | True micro frontends    |
| iFrames              | Complete isolation                                | Limited communication, SEO issues  | Legacy integration      |

## Industry Examples

- **Shopify**: Uses package-based approach for admin sections
- **GitHub**: Uses package-based approach for feature modules
- **Vercel**: Uses package-based approach for dashboard sections
- **Netlify**: Uses package-based approach for admin features

This approach provides the best balance of simplicity, maintainability, and scalability for most enterprise applications.
