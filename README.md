# About Project

This repository contains the source code for the [Centher Platform - app.centher.io](https://app.centher.io).

### Technologies

👉 [Next.js](https://nextjs.org/)

👉 [Tailwind CSS](https://tailwindcss.com/)

👉 [TypeScript](https://www.typescriptlang.org/)

👉 [Zustand](https://github.com/pmndrs/zustand)

👉 [Socket.io](https://socket.io/)

👉 [Moralis](https://moralis.io/)

👉 [Ether.js](https://docs.ethers.io/v5/)

👉 [GraphQL](https://graphql.org/)

👉 [ESLint](https://eslint.org/)

👉 [Prettier](https://prettier.io/)

👉 [Yarn](https://classic.yarnpkg.com/lang/en/)

👉 [Husky](https://typicode.github.io/husky/)

👉 [Lint Staged](https://github.com/okonet/lint-staged)

👉 [Commitlint](https://commitlint.js.org)

👉 [GitHub Actions](https://docs.github.com/en/actions)

### Editor

👉 [Visual Studio Code](https://code.visualstudio.com/)

### Node.js Version

👉 [Node.js: 16.18.1](https://nodejs.org/en/)

### Package Manager

👉 [Yarn: 1.22.19](https://yarnpkg.com/)

---

### Setup

```bash
git clone git@github.com:algoalliance-io/app.centher.io.git
```

### Install Yarn

```bash
npm install -g yarn
```

### Dependencies Installation

Change directory to project root and run:

```bash
yarn install
```

### Run Project

```bash
yarn dev
```

### Build Project

```bash
yarn build
```

### Lint Project

```bash
yarn lint
```

### Format Project

```bash
yarn format
```

---

### File Naming Conventions

👉 All the files and folder should use dot (.) as separater instead of hyphens or underscores (e.g. `file.name.js` or `folder.name`)

👉 For all pages the file extension should be `.page.tsx` (e.g. `home.page.tsx`)

---

### Folder Structure

```bash
├── .github # GitHub Actions and Workflows
├── .husky # Husky Git Hooks
├── .next # Next.js Build Output
├── .vscode # VS Code Settings
├── @types # TypeScript Type Definitions
├── assets # Static Assets
├── components # Shared Components which can be used across the app
│   ├── button # Component
│   │   ├── index.tsx
│   │   ├── button.module.css # CSS Modules - Optional
│   │   └── ...
│   └── ...
├── constants # Constants for the app
├── hooks # Custom Hooks
│   ├── use.user # Hook
│   │   ├── index.tsx
│   │   └── ...
│   └── ...
├── models # TypeScript types and interfaces for api responses and other data
├── pages
│   ├── login # Page
│   │   ├── _components # Page Components which are only used in this page (e.g. button used only in this page) - Optional
│   │   │   ├── button # Component
│   │   │   │   ├── index.tsx
│   │   │   │   ├── button.module.css # CSS Modules - Optional
│   │   │   │   └── ...
│   │   └── index.page.tsx
│   ├── signup # Page
│   │   └── index.page.tsx
│   ├── ... # Other Pages
│   ├── index.page.tsx
│   └── _app.page.tsx
├── public # Public Assets (e.g. favicons and images which can be accessed by url)
│   ├── favicons
│   │   ├── favicon.ico
│   │   └ ...
│   ├── images
│   │   ├── logo.png
│   │   └ ...
│   └── ... # Other Public Assets
├── socket.io # Socket.io related code
├── store # Zustand Stores for global state management
├── styles # Global Styles
├── subgraph # Subgraph related queries and code
├── utils # Utility Functions for the app
├── web3 # All web3 related stuff
│   ├── abis # Smart Contract ABIs
│   │   ├── busd.json
│   │   └ ...
│   ├── constants # Web3 Constants
│   │   ├── contracts.ts
│   │   └ ...
│   ├── contexts # React Contexts for web3
│   ├── hooks # Web3 Hooks
│   ├── utils # Web3 Utility Functions
│   ├── connector.ts # Web3 Connector
│   ├── index.ts
│   └── ... # Other Web3 related stuff
├── middleware.page.ts # Next.js Middleware - Runs before every request - Used for authentication
├── next-env.d.ts # Next.js Types
├── next.config.js # Next.js Configuration
├── commitlint.config.js # Commitlint Configuration
├── tailwind.config.js # TailwindCSS Configuration
├── postcss.config.js # PostCSS Configuration for TailwindCSS
├── tsconfig.json
├── README.md
├── .env.development # Environment Variables for Development - required for local development
├── .env.[production|staging] # Environment Variables for Production and Staging- optional for local development
├── .env.[development|production|staging].local # Overrides for Environment Variables during development - optional
├── .eslintrc.json
├── .eslintignore
├── .prettierrc
├── .prettierignore
├── .gitignore
├── package.json
└── yarn.lock
```

---

### Git Commit Message

The commit message should be structured as follows:

```bash
# e.g
git commit -m "feat: added a button which closes the modal"
```

### Git Commit Message Types

👉 **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)

👉 **chore**: Other changes that don't modify src or test files

👉 **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)

👉 **docs**: Documentation only changes

👉 **feat**: A new feature

👉 **fix**: A bug fix

👉 **perf**: A code change that improves performance

👉 **refactor**: A code change that neither fixes a bug nor adds a feature

👉 **revert**: Reverts a previous commit

👉 **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)

👉 **test**: Adding missing tests or correcting existing tests
