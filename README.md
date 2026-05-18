# Portfolio OS

A **desktop-OS-inspired** developer portfolio built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. Draggable windows, a macOS-style dock, and a terminal emulator — all in the browser.

---

## Table of Contents

- [Architecture](#architecture)
- [File Structure](#file-structure)
- [Type Reference](#type-reference)
- [Component API](#component-api)
- [Data Flow](#data-flow)
- [Styling Conventions](#styling-conventions)
- [Customization Guide](#customization-guide)
- [Scripts](#scripts)

---

## Architecture

### Component Tree

```
PortfolioOS                          ← Top-level orchestrator
├── MenuBar                          ← Clock, date, menu labels
├── DesktopIcons                     ← Static desktop shortcuts
├── WelcomeOverlay                   ← "Click an app to start" text
├── SVG (stars) + div (glow orbs)    ← Background decorations
├── [Window] × N                     ← One per open app
│   ├── Title bar (traffic lights)   ← Close / Minimize / Maximize
│   └── WindowContent                ← Routes id → content component
│       ├── AboutContent
│       ├── ProjectsContent
│       ├── SkillsContent
│       ├── ContactContent
│       └── TerminalContent
└── Dock                             ← App launcher
    └── DockItem × N                 ← Individual icon + tooltip + indicator
```

### Data Flow

```
User clicks DockItem
        │
        ▼
PortfolioOS.openWindow(id)
        │
        ├── Updates zIndex counter zCounter++
        ├── Adds entry to windows state Record<string, WindowState>
        │      └── { pos: {x, y}, minimized: false, z: N }
        └── Window renders with config from WINDOW_CONFIGS[id]

User drags Window title bar
        │
        ▼
Window.onMouseDown → mousemove/mouseup listeners
        │
        ├── Clamps position to desktopRef boundaries
        └── Updates internal position state (not lifted to parent)

User clicks traffic-light buttons
        │
        ├── Close   → PortfolioOS.closeWindow(id)  → deletes from windows
        ├── Minimize → PortfolioOS.minimizeWindow(id) → sets minimized: true
        └── Maximize → local setIsMaximized toggle  → fullscreen within desktop

Window focus (click on any window)
        │
        ▼
PortfolioOS.focusWindow(id) → bumps zCounter → sets highest zIndex
```

### `'use client'` Boundaries

All interactive components use `"use client"`:

| File | Reason |
|---|---|
| `hooks/useTime.ts` | `useState`, `useEffect` |
| `components/os/PortfolioOS.tsx` | `useState`, `useRef`, `useCallback` |
| `components/os/Window.tsx` | `useState`, `useRef`, `useCallback`, mouse events |
| `components/os/DockItem.tsx` | `useState` (hover), `onClick` |
| `components/os/AboutContent.tsx` | None strictly needed, but kept consistent |
| `components/os/ProjectsContent.tsx` | `useState` (active project) |
| `components/os/TerminalContent.tsx` | `useState`, `useRef`, `useEffect`, keyboard events |

Static data files (`data/`, `types/`) and the `WindowContent` dispatcher remain server-safe.

---

## File Structure

```
├── types/
│   └── portfolio.ts                 # Shared TypeScript interfaces
├── data/
│   ├── dockApps.ts                  # Dock app definitions
│   ├── projects.ts                  # Project portfolio entries
│   ├── skills.ts                    # Skill categories
│   ├── terminalLines.ts             # Terminal auto-type script
│   ├── windowConfigs.ts             # Window size/title/content mapping
│   └── wallpaper.ts                 # CSS gradient wallpaper string
├── hooks/
│   └── useTime.ts                   # Live clock (updates every second)
├── components/
│   └── os/
│       ├── PortfolioOS.tsx          # Main orchestrator
│       ├── MenuBar.tsx              # Top menu bar with clock
│       ├── DesktopIcons.tsx         # Desktop shortcut icons
│       ├── WelcomeOverlay.tsx       # Welcome message (shown when no windows open)
│       ├── Window.tsx               # Draggable, resizable window frame
│       ├── WindowContent.tsx        # Routes content id → content component
│       ├── AboutContent.tsx         # Profile card with bio
│       ├── ProjectsContent.tsx      # File explorer + project detail
│       ├── SkillsContent.tsx        # JSON-formatted skill listing
│       ├── ContactContent.tsx       # Contact cards + availability badge
│       ├── TerminalContent.tsx      # Auto-typing terminal with live input
│       └── DockItem.tsx             # Dock icon with tooltip + indicator
├── app/
│   ├── layout.tsx                   # Root layout (body: overflow-hidden)
│   ├── page.tsx                     # Entry point → renders <PortfolioOS />
│   └── globals.css                  # Tailwind v4 imports + theme variables
├── public/                          # Static assets
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## Type Reference

All interfaces defined in `types/portfolio.ts`.

### `DockApp`

```ts
interface DockApp {
  id: string    // Unique identifier, matches WindowConfig key
  icon: string  // Emoji or icon string
  label: string // Tooltip label text
}
```

### `Project`

```ts
interface Project {
  name: string        // Display name
  tech: string[]      // Technology tags
  desc: string        // Description text
  color: string       // Background hex color (e.g. "#1a6b4a")
  accent: string      // Accent hex color for highlights
}
```

### `SkillCategory`

```ts
interface SkillCategory {
  cat: string     // Category name (e.g. "Frontend")
  items: string[] // Skill items within the category
}
```

### `TerminalLine`

```ts
interface TerminalLine {
  ps?: boolean  // true = prompt line (shows "kaptain@portfolio:~$")
  cmd?: string  // Command text (rendered after prompt)
  out?: string  // Output text (rendered indented below prompt)
}
```

### `WindowConfig`

```ts
interface WindowConfig {
  title: string   // Window title bar text
  icon: string    // Emoji shown in title bar
  w: number       // Default width in pixels
  h: number       // Default height in pixels
  content: string // Content identifier (matches DockApp.id)
}
```

### `WindowState`

```ts
interface WindowState {
  pos: { x: number; y: number }  // Pixel position within desktop area
  minimized: boolean              // Whether window is hidden
  z: number                       // Z-index (used for focus stacking)
}
```

---

## Component API

### `PortfolioOS`

| Prop | Type | Default | Description |
|---|---|---|---|
| _(none)_ | — | — | Top-level component, no props. Manages all window state. |

### `MenuBar`

| Prop | Type | Description |
|---|---|---|
| `dateStr` | `string` | Formatted date string (e.g. "Mon, May 18") |
| `timeStr` | `string` | Formatted time string (e.g. "03:29 PM") |

### `Window`

| Prop | Type | Description |
|---|---|---|
| `id` | `string` | Unique window identifier |
| `config` | `WindowConfig` | Window configuration (title, size, icon) |
| `pos` | `{ x: number; y: number }` | Initial position |
| `zIndex` | `number` | Stacking order |
| `isMinimized` | `boolean` | Whether window is hidden |
| `onClose` | `() => void` | Close button handler |
| `onMinimize` | `() => void` | Minimize button handler |
| `onFocus` | `() => void` | Focus handler (brings to front) |
| `desktopRef` | `RefObject<HTMLDivElement>` | Desktop container ref for drag boundary |

### `DockItem`

| Prop | Type | Description |
|---|---|---|
| `app` | `DockApp` | App definition (icon, label) |
| `isOpen` | `boolean` | Shows green indicator dot |
| `onClick` | `() => void` | Click handler (opens window / launches URL) |

### `WindowContent`

| Prop | Type | Description |
|---|---|---|
| `id` | `string` | Routes to `AboutContent`, `ProjectsContent`, `SkillsContent`, `ContactContent`, or `TerminalContent` |

### Content Components

All content components (`AboutContent`, `ProjectsContent`, `SkillsContent`, `ContactContent`, `TerminalContent`) accept **no props**. They read from their respective data files directly.

### `WelcomeOverlay`

| Prop | Type | Description |
|---|---|---|
| `visible` | `boolean` | When `true`, shows the centered welcome text |

### `DesktopIcons`

No props. Renders static shortcuts (`Cameroon.travel`, `Resume.pdf`).

---

## Data Flow

### Window Lifecycle

1. **Open** — User clicks `DockItem` → `PortfolioOS.openWindow(id)` computes centered position + cascade offset, creates `WindowState` entry
2. **Focus** — Any click on a window calls `focusWindow(id)` → bumps its `z` value above all others
3. **Drag** — `Window.onMouseDown` registers global `mousemove`/`mouseup` listeners, clamps to `desktopRef` boundaries
4. **Maximize** — Local `isMaximized` state toggles between absolute position + size and `top:0/left:0/100%/calc(100%-72px)`
5. **Minimize** — Sets `WindowState.minimized = true` → `Window` returns `null`, DockItem shows green dot removed
6. **Close** — Deletes entry from `windows` record → component unmounts

### State Ownership

| State | Owner | Rationale |
|---|---|---|
| `windows` + `zCounter` | `PortfolioOS` | Multiple windows need shared state for focus stacking |
| `position` + `isMaximized` | `Window` | Drag state is local to each window; no other component needs it |
| `active (project index)` | `ProjectsContent` | Local UI selection state |
| `lines` + `idx` + `input` | `TerminalContent` | Terminal is entirely self-contained |
| `hovered` | `DockItem` | Hover animation is local |
| `time` | `useTime` hook | Consumed by `PortfolioOS` → passed to `MenuBar` |

---

## Styling Conventions

### Tailwind v4

- All static styling uses Tailwind utility classes
- Dynamic runtime values (position, z-index, dynamic colors) use inline `style`
- Custom hex colors use arbitrary value syntax: `text-[#6b8fa0]`, `bg-[#0d1f2d]`
- Opacity modifiers use slash syntax: `border-[#1e3a4a]/50`, `bg-white/7`

### Inline Styles (when necessary)

Only for values that change at runtime:

```tsx
// ✅ Dynamic position — must be inline
style={{ top: position.y, left: position.x, width: size.w, height: size.h }}

// ✅ Dynamic project accent colors — data-driven
style={{ borderLeft: `3px solid ${project.accent}` }}

// ❌ Static values — use Tailwind classes
// BAD:  style={{ color: "#6b8fa0", fontSize: 12 }}
// GOOD: className="text-[#6b8fa0] text-xs"
```

### Typography

The OS chrome uses `-apple-system, BlinkMacSystemFont, 'SF Pro Display'`. Window content uses `font-mono` (`'JetBrains Mono', 'Fira Code'`).

### CSS Variables

Defined in `app/globals.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

---

## Customization Guide

### Adding a New Window / Dock App

1. **Define config** in `data/windowConfigs.ts`:
   ```ts
   newsletter: {
     title: "Newsletter",
     icon: "📰",
     w: 480,
     h: 360,
     content: "newsletter",
   }
   ```

2. **Add to dock** in `data/dockApps.ts`:
   ```ts
   { id: "newsletter", icon: "📰", label: "Newsletter" }
   ```

3. **Create content component** at `components/os/NewsletterContent.tsx`:
   ```tsx
   "use client"
   export function NewsletterContent() { return <div>...</div> }
   ```

4. **Register in dispatcher** at `components/os/WindowContent.tsx`:
   ```tsx
   import { NewsletterContent } from "./NewsletterContent"
   // add case: case "newsletter": return <NewsletterContent />
   ```

### Updating Personal Info

- **Bio + name**: Edit `components/os/AboutContent.tsx`
- **Projects**: Edit `data/projects.ts`
- **Skills**: Edit `data/skills.ts`
- **Contact**: Edit `components/os/ContactContent.tsx` (`CONTACTS` array)
- **Terminal script**: Edit `data/terminalLines.ts`

### Changing Theme / Wallpaper

Edit `data/wallpaper.ts` — the `WALLPAPER` string is a CSS `background` value supporting multiple gradients.

### Changing Terminal Colors

Terminal styling is in `components/os/TerminalContent.tsx`. Key color tokens:
- Prompt username: `text-[#34d399]`
- Prompt symbol: `text-[#4a6b7a]`
- Command text: `text-[#e2e8f0]`
- Output text: `text-[#60a5fa]`

### Changing Window Default Sizes

Edit `data/windowConfigs.ts` — adjust `w` and `h` per window.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
