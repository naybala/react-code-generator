# React Code Generator

A powerful CLI tool to quickly generate React core features including components, custom hooks, and React Query integrations based on your input.
This tool is designed to streamline the project architecture by scaffolding out common patterns and structures in React applications, ensuring consistency and reducing boilerplate.

---

## Features

- **React Components**: Generates boilerplate for `Form` and `Table` components.
- **Custom Hooks**: Creates `useForm` and `useTable` hooks for business logic.
- **Data Fetching (React Query)**: Scaffolds `Queries`, `Mutations`, and `Query Keys`.
- **Validation**: Includes `Zod` schemas for form validation.
- **Localization**: Generates i18n files for English and Myanmar.
- **TypeScript**: Full TypeScript support with dynamic type generation.
- **API integration**: Generates API service definitions.
- **Routes**: Scaffolds feature-specific routes.

---

## Installation

Install via npm (recommended as a dev dependency):

```bash
npm install @naybala/react-code-generator --save-dev
```

Add a script to your `package.json`:

```json
"scripts": {
  "make-core-ui-feature": "node ./node_modules/react-code-generator/index.js"
}
```

## Usage

Run the following command to start the interactive generator:

```bash
npm run make-core-ui-feature
```

## Template Structure

The generator uses the following template structure to scaffold features:

```bash
templates/
├── api/
│   └── api.ts
├── hooks/
│   ├── useForm.ts
│   └── useTable.ts
├── components/
│   ├── Form.tsx
│   └── Table.tsx
├── queries/
│   ├── keys.ts
│   ├── list.ts
│   └── detail.ts
├── mutations/
│   └── mutations.ts
├── schema/
│   └── schema.ts
├── types/
│   └── types.ts
├── routes/
│   └── routes.ts
├── i18n/
│   ├── en.js
│   └── mm.js
└── index.ts
```
