# Story 1.1: Initialize Next.js Project with Tech Stack

Status: done

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

- [x] Task 1: Initialize Next.js project (AC: #1, #6)
  - [x] Run `npx create-next-app@latest zoniq --typescript --tailwind --eslint --app --src-dir --turbopack --import-alias "@/*"`
  - [x] Verify Next.js 16, React 19, TypeScript 5 are installed
  - [x] Confirm src-dir and App Router structure is correct
- [x] Task 2: Initialize shadcn/ui (AC: #3)
  - [x] Run `npx shadcn@latest init` with default settings
  - [x] Configure Manrope font in `src/app/layout.tsx`
  - [x] Add CSS variables for Zoniq design tokens
- [x] Task 3: Configure Tailwind design tokens (AC: #2)
  - [x] Update `tailwind.config.ts` with Zoniq color palette
  - [x] Add Primary: #FF6B35 (warm orange)
  - [x] Add Dark: #2D1810 (dark brown)
  - [x] Configure Manrope as primary font
- [x] Task 4: Install core dependencies (AC: #4)
  - [x] `npm install @xyflow/react framer-motion react-hook-form @hookform/resolvers zod`
- [x] Task 5: Configure code quality tools (AC: #5)
  - [x] Verify ESLint configuration from create-next-app
  - [x] Add Prettier with Tailwind plugin: `npm install -D prettier prettier-plugin-tailwindcss`
  - [x] Create `.prettierrc` configuration file
- [x] Task 6: Update globals.css with design system (AC: #2)
  - [x] Add CSS custom properties for Zoniq colors
  - [x] Configure Manrope font imports

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

**Tailwind v4 CSS-Based Theming (in globals.css):**
```css
@theme inline {
  --color-zoniq-primary: var(--zoniq-primary);
  --color-zoniq-dark: var(--zoniq-dark);
  --font-sans: var(--font-manrope), system-ui, sans-serif;
}

:root {
  --zoniq-primary: oklch(0.708 0.185 38.8);  /* ~#FF6B35 */
  --zoniq-dark: oklch(0.205 0.015 38.8);     /* ~#2D1810 */
}
```

> **Note:** Tailwind v4 uses CSS-based configuration via `@theme inline {}` in globals.css instead of tailwind.config.ts

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

**1. `src/app/globals.css` - Add design tokens (Tailwind v4 format):**
```css
@import 'tailwindcss';

@theme inline {
  --color-zoniq-primary: var(--zoniq-primary);
  --color-zoniq-dark: var(--zoniq-dark);
  --font-sans: var(--font-manrope), system-ui, sans-serif;
}

:root {
  --zoniq-primary: oklch(0.708 0.185 38.8);  /* ~#FF6B35 warm orange */
  --zoniq-dark: oklch(0.205 0.015 38.8);     /* ~#2D1810 dark brown */
}
```

**2. No tailwind.config.ts needed** - Tailwind v4 uses CSS-based configuration. Theme extensions are defined in globals.css using `@theme inline {}` directive.

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

Claude Code (claude-5-high-weight)

### Debug Log References

None - implementation proceeded without issues.

### Completion Notes List

- **Task 1:** Created Next.js 16.1.6 project with React 19.2.3, TypeScript 5.9.3, Tailwind CSS 4, ESLint, App Router, src-dir, and Turbopack
- **Task 2:** Initialized shadcn/ui with defaults, configured Manrope font via next/font/google
- **Task 3:** Configured Zoniq design tokens (primary: oklch(0.708 0.185 38.8) ~ #FF6B35, dark: oklch(0.205 0.015 38.8) ~ #2D1810) using Tailwind v4 CSS-based theming in globals.css
- **Task 4:** Installed @xyflow/react, framer-motion, react-hook-form, @hookform/resolvers, zod, date-fns, sonner
- **Task 5:** Added Prettier with prettier-plugin-tailwindcss, created .prettierrc config
- **Task 6:** Updated globals.css with zoniq-primary and zoniq-dark CSS custom properties, configured font-sans to use Manrope

All validation passed: `npm run lint` (0 errors), `npm run build` (compiled successfully)

### File List

**Created:**
- zoniq/ (entire Next.js project)
- zoniq/src/app/layout.tsx (Manrope font configuration)
- zoniq/src/app/globals.css (Zoniq design tokens in Tailwind v4 format)
- zoniq/src/app/page.tsx (Zoniq welcome page)
- zoniq/src/lib/utils.ts (shadcn cn utility - auto-generated)
- zoniq/src/components/ui/.gitkeep (placeholder for shadcn components)
- zoniq/components.json (shadcn configuration)
- zoniq/.prettierrc (Prettier configuration)
- zoniq/.prettierignore (Prettier ignore patterns)

**Modified:**
- zoniq/package.json (added core, dev dependencies, format script)

**Deleted:**
- zoniq/public/*.svg (removed placeholder SVGs: file.svg, globe.svg, next.svg, vercel.svg, window.svg)

## Change Log

- 2026-03-03: Story completed - Next.js 16 project initialized with full tech stack
- 2026-03-03: Code review fixes - Added src/components/ui/ directory, updated page.tsx with Zoniq branding
- 2026-03-03: Code review round 2 - Added format script, .prettierignore, removed placeholder SVGs, updated Dev Notes for Tailwind v4 accuracy
