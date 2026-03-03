# Story 1.1: Initialize Next.js Project with Tech Stack

Status: ready-for-dev

## Story

As a developer,
I want a Next.js 16 project initialized with TypeScript, Tailwind, shadcn/ui, and core dependencies,
So that I have a consistent foundation for building the application.

## Acceptance Criteria

1. **Given** a new project repository **When** the developer runs the initialization script **Then** a Next.js 16 project is created with React 19 and TypeScript 5
2. **And** Tailwind CSS 4 is configured with the project design tokens (Primary: #FF6B35, Dark: #2D1810)
3. **And** shadcn/ui is initialized with the Manrope font family
4. **And** @xyflow/react, framer-motion, react-hook-form, and zod are installed
5. **And** ESLint and Prettier are configured
6. **And** the project structure follows src-dir convention with App Router

## Tasks / Subtasks

- [ ] Task 1: Initialize Next.js project (AC: #1, #6)
  - [ ] Run `npx create-next-app@latest zoniq --typescript --tailwind --eslint --app --src-dir --turbopack --import-alias "@/*"`
  - [ ] Verify Next.js 16, React 19, TypeScript 5 are installed
  - [ ] Confirm src-dir and App Router structure is correct
- [ ] Task 2: Initialize shadcn/ui (AC: #3)
  - [ ] Run `npx shadcn@latest init` with default settings
  - [ ] Configure Manrope font in `src/app/layout.tsx`
  - [ ] Add CSS variables for Zoniq design tokens
- [ ] Task 3: Configure Tailwind design tokens (AC: #2)
  - [ ] Update `tailwind.config.ts` with Zoniq color palette
  - [ ] Add Primary: #FF6B35 (warm orange)
  - [ ] Add Dark: #2D1810 (dark brown)
  - [ ] Configure Manrope as primary font
- [ ] Task 4: Install core dependencies (AC: #4)
  - [ ] `npm install @xyflow/react framer-motion react-hook-form @hookform/resolvers zod`
- [ ] Task 5: Configure code quality tools (AC: #5)
  - [ ] Verify ESLint configuration from create-next-app
  - [ ] Add Prettier with Tailwind plugin: `npm install -D prettier prettier-plugin-tailwindcss`
  - [ ] Create `.prettierrc` configuration file
- [ ] Task 6: Update globals.css with design system (AC: #2)
  - [ ] Add CSS custom properties for Zoniq colors
  - [ ] Configure Manrope font imports

## Dev Notes

### Architecture Patterns & Constraints

**Technology Stack (from Architecture Document):**
- Next.js 16 with React 19 and TypeScript 5 (strict mode)
- Tailwind CSS 4 with PostCSS and CSS variables for theming
- shadcn/ui component library
- App Router with src-dir convention
- Turbopack for development, Webpack for production
- Import alias: `@/*` → `./src/*`

**Project Structure (Expected):**
```
zoniq/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Tailwind + CSS variables
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   └── ui/                 # shadcn/ui components
│   └── lib/
│       └── utils.ts            # cn() utility
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── next.config.ts
```

**Naming Conventions:**
- React components: `PascalCase.tsx`
- Component folders: `kebab-case/`
- Utilities: `camelCase.ts`
- CSS classes: Use Tailwind utility classes

### Design Tokens

**Color Palette:**
| Token | Hex | Usage |
|-------|-----|-------|
| Primary | #FF6B35 | CTAs, links, accents |
| Dark | #2D1810 | Text, dark backgrounds |

**Typography:**
- Font Family: Manrope (single font family)
- Base spacing unit: 8px

**Tailwind Config Extension:**
```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          // Add shades as needed
        },
        dark: {
          DEFAULT: '#2D1810',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

### Initialization Commands

**Step 1 - Create Next.js project:**
```bash
npx create-next-app@latest zoniq \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --turbopack \
  --import-alias "@/*"
```

**Step 2 - Initialize shadcn/ui:**
```bash
cd zoniq
npx shadcn@latest init
# Select: Default style, CSS variables, React Server Components: Yes
```

**Step 3 - Install core dependencies:**
```bash
# React Flow for workflow diagrams
npm install @xyflow/react

# Animations
npm install framer-motion

# Form handling
npm install react-hook-form @hookform/resolvers zod

# Date utilities (for future use)
npm install date-fns

# Toast notifications
npm install sonner
```

**Step 4 - Install dev dependencies:**
```bash
npm install -D prettier prettier-plugin-tailwindcss
```

### Files to Create/Modify

**1. `src/app/globals.css` - Add design tokens:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-primary: 255 107 53;
    --color-dark: 45 24 16;
  }
}

@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
```

**2. `tailwind.config.ts` - Extend with Zoniq theme:**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        dark: 'rgb(var(--color-dark) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

**3. `.prettierrc` - Formatting config:**
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**4. `src/app/layout.tsx` - Configure Manrope font:**
```typescript
import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: 'Zoniq',
  description: 'AI-powered requirements and project management for Mendix teams',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
```

### Testing Standards

- Run `npm run lint` to verify ESLint passes
- Run `npm run build` to verify TypeScript compiles without errors
- Verify `npm run dev` starts development server successfully

### Project Structure Notes

- Follow the unified project structure from architecture document
- Use `src/` directory as specified
- Place shadcn/ui components in `src/components/ui/`
- Create `src/lib/` for utilities (cn function will be auto-generated by shadcn)

### References

- [Architecture Document: Starter Template Evaluation](_bmad-output/planning-artifacts/_docs/architecture.md#starter-template-evaluation)
- [Architecture Document: Project Structure](_bmad-output/planning-artifacts/_docs/architecture.md#complete-project-directory-structure)
- [Architecture Document: Design Tokens](_bmad-output/planning-artifacts/_docs/architecture.md#ux-requirements)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs/installation/next)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
