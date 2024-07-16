## About Project

This repository contains the source code for the [Centher Platform - app.centher.io](https://app.centher.io).

### Technologies

👉 [Next.js](https://nextjs.org/)

👉 [Tailwind CSS](https://tailwindcss.com/)

👉 [TypeScript](https://www.typescriptlang.org/)

👉 [Zustand](https://github.com/pmndrs/zustand)

👉 [Socket.io](https://socket.io/)

👉 [Moralis](https://moralis.io/)

👉 [Ethers.js](https://docs.ethers.io/v5/)

👉 [GraphQL](https://graphql.org/)

👉 [ESLint](https://eslint.org/)

👉 [Prettier](https://prettier.io/)

👉 [Yarn](https://classic.yarnpkg.com/lang/en/)

👉 [Husky](https://typicode.github.io/husky/)

👉 [Lint Staged](https://github.com/okonet/lint-staged)

👉 [Commitlint](https://commitlint.js.org)

👉 [GitHub Actions](https://docs.github.com/en/actions)

👉 [Docker](https://www.docker.com/)

### Editor

👉 [Visual Studio Code](https://code.visualstudio.com/)

### Node.js Version

👉 [Node.js: 16.18.1](https://nodejs.org/en/)

### Package Manager

👉 [Yarn: 1.22.19](https://yarnpkg.com/)

---

### Docker setup

First install `make` :

### Mac :

```bash
xcode-select --install
```

In the windows that pops up, click `Install`, and agree to the Terms of Service.

### Linux :

```bash
sudo apt install make
```

### Windows :

```bash
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

```bash
choco install make
```

---

### Clone Project

```bash
git clone git@github.com:algoalliance-io/app.centher.io.git
```

### Start development

Make sure that file `.env.development` exists in project's root in advance, then:

```bash
make start-development
```

### Stop development

```bash
make stop-development
```

### Build development

```bash
make build-development
```

### Remove resources

Use this command to remove all the resources created by `make start-development` command. Usually used when you install a new npm package and want to rebuild the docker images.

```bash
make rm-resources
```

---

### Branching Model

👉 [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
We will be using the GitHub Flow branching model for this project.

💥 **Note:** We will be using the `main` branch as the default branch instead of `master`.

**Branches:**

👉 `main` - The default branch. All the changes will be merged into this branch and deployed to production.

👉 `staging` - The staging branch. All the changes will be merged into this branch and deployed to staging.

👉 `ft-feature-name` - Feature branches. All the changes should be made in a separate feature branch and a pull request should be created to merge the changes into the `staging` branch.

**Pull Requests:**

👉 All the changes should be made in a separate _feature branch_ and a _pull request_ should be created to merge the changes into the `staging` branch first and deployed to [devapp.centher.io](https://devapp.centher.io)

👉 After the changes are tested in `staging`, a pull request should be created to merge the changes into the `main` branch and deployed to [app.centher.io](https://app.centher.io)

---

### File Naming Conventions

👉 All the files and folder should use dot (.) as separater instead of hyphens or underscores (e.g. `file.name.js` or `folder.name`). This is to avoid issues with case-insensitive file systems.

👉 For all pages the file extension should be `.page.tsx` (e.g. `home.page.tsx`)

---

### Folder Structure

```bash
├── .aws # AWS ECS and ECR configuration files
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
├── docker # docker and docker-compose files
│   ├── development
│   │   ├── docker-compose.yml
│   │   └── Dockerfile
│   ├── production
│   │   └── Dockerfile
│   └── staging
│       └── Dockerfile
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
├── .dockerignore
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
