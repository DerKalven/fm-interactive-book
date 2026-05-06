# FM Accumulation Function Prototype

This is the first functional prototype for an interactive SOA Exam FM financial mathematics book.

## Prototype

**Concept:** Measurement of Interest  
**Visualizer:** Accumulation Function Visualizer  
**Core identity:** `A(t) = P · a(t)`

The prototype compares:

- Simple interest: `a(t)=1+it`
- Compound interest: `a(t)=(1+i)^t`

## Tech stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Recharts
- react-katex / KaTeX

## Run locally

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Important files

```text
src/app/page.tsx
src/app/layout.tsx
src/app/globals.css
src/components/visualizers/AccumulationFunctionVisualizer.tsx
src/components/visualizers/FormulaPanel.tsx
src/components/visualizers/DecompositionBar.tsx
src/components/visualizers/ValueCard.tsx
src/lib/financial-math/interest.ts
src/lib/financial-math/formatters.ts
src/exercises/fm-it-001.json
src/concepts/interest-theory/measurement-of-interest.mdx
```

## GitHub setup

```bash
git init
git add .
git commit -m "Add accumulation function prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

## Deploy on Vercel

1. Push this project to GitHub.
2. Go to Vercel.
3. Click **New Project**.
4. Import the GitHub repository.
5. Use the default Next.js settings.
6. Deploy.
