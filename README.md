# Experiment

This is an experimental project built with microfrontends architecture to try out different technologies and how they work with the tools, frameworks, libraries etc. that I've already worked with before. Basically to broaden my knowledge of tech.

## How to use

### Clone and run

Install the dependencies

```bash
pnpm i
```

Run the apps

```bash
pnpm run dev
```

## What's Included?

The example is a monorepo built with [Turborepo](https://turborepo.org/) with the following setup:

- Everything is in [TypeScript](https://www.typescriptlang.org/)
- React is used for the applications in [./apps](./apps)
- Shared packages used by the apps in [./packages](./packages)
- Storybook is used for the components that are part of the [`design-system`](./packages/design-system) package
- The ESLint config lives in [eslint-config-showoff](./packages/eslint-config-showoff)

## How it Works

There are many strategies for designing microfrontends and your approach will be dictated by how you want to structure your applications and teams.

### Monorepo Support

One of the challenges of building microfrontends is dependency management and build systems. In the packages and apps in this monorepo, we'll be using [Turborepo](https://turborepo.org/) and Changesets to earn great developer experience for our teams with minimal configuration.
