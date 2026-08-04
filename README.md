# Dimension Splitter

Next.js App Router + TypeScript application that compares two Rick and Morty characters and separates their exclusive and shared episodes using the public REST API.

## Setup

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run lint
npm run format:check
npm test
npm run build
```

Execute the end-to-end user flow with the isolated test server:

```bash
npm run test:e2e
```

The character selectors paginate independently. Episode analysis remains locked until one character is selected in each section.
