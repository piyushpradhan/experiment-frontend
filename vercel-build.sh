#!/bin/bash
set -e

echo "Installing dependencies..."
pnpm install

echo "Building design system..."
cd packages/design-system && pnpm build && cd ../..

echo "Building shared components..."
cd packages/shared-components && pnpm build && cd ../..

echo "Building messaging app..."
cd apps/messaging && pnpm build && cd ../..

echo "Building collaboration app..."
cd apps/collaboration && pnpm build && cd ../..

echo "Building host app..."
cd apps/host && pnpm build && cd ../..

echo "Build completed successfully!"
echo "Checking dist directory..."
ls -la apps/host/dist/ 