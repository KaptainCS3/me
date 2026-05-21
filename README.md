# Portfolio OS

A **desktop-OS-inspired** developer portfolio built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. Draggable windows, a macOS-style dock, a built-in terminal emulator, interactive project previews with live proxy tunneling — all in the browser.

> **Live demo**: [kaptaincs3.dev](https://kaptaincs3.dev) (or wherever you deploy)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Customization Guide](#customization-guide)
  - [Personal Info](#personal-info)
  - [Projects](#projects)
  - [Skills](#skills)
  - [Contact](#contact)
  - [Themes & Colors](#themes--colors)
  - [Dock Apps](#dock-apps)
  - [Terminal Commands](#terminal-commands)
  - [Wallpaper](#wallpaper)
- [Architecture](#architecture)
- [Proxy System](#proxy-system)
- [Building From Scratch](#building-from-scratch)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Scripts](#scripts)

---

## Features

| Feature | Description |
|---|---|
| **Window Manager** | Drag, minimize, maximize, close, and stack overlapping windows with z-index focus |
| **Dock** | macOS-style app launcher with hover tooltips, bounce animation, minimize-on-click |
| **Menu Bar** | Clock, date, system menus (File, Edit, View, Window, Help) with keyboard shortcuts |
| **Terminal Emulator** | Bash-like shell with 20+ commands (ls, cat, cd, neofetch, fortune, theme, whoami), tab autocomplete, command history |
| **Spotlight Search** | `⌘K` global search across apps, projects, and skills |
| **Boot Sequence** | Animated BIOS-style boot screen with log output |
| **Project Viewer** | Interactive project cards with live iframe preview via proxy tunnel |
| **Proxy Tunnel** | Built-in reverse proxy to embed live websites (bypasses CORS/CSP framing restrictions) |
| **Themes** | Dark, Matrix (green terminal), Retro (Win95), Light |
| **Resume Viewer** | Inline PDF viewer |
| **File Manager** | Desktop icons with drag-and-drop, virtual filesystem with mkdir/touch/rm |
| **Mobile Responsive** | Touch support, collapsible sidebar, adaptive layouts |
| **Persistent State** | Zustand + localStorage — windows, theme, VFS survive refreshes |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **UI Library** | React 19 |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS v4 |
| **State Management** | Zustand v5 (with persist middleware) |
| **Icons** | react-icons (Feather) |
| **Fonts** | Geist (Google Fonts) |
| **PDF** | react-pdf |
| **Screenshots** | html2canvas |
| **Linting** | ESLint 9 |
| **Package Manager** | npm |

---

## Quick Start

```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the boot screen, then the desktop.

### Production Build

```bash
npm run build
npm run start
```

---

## Customization Guide

### Personal Info

Edit `data/about.ts` — one file controls your name, title, email, social links, languages, tools, work experience, and education.

```ts
export const RESUME: Resume = {
  name: "Your Name",
  title: "Your Title",
  email: "you@example.com",
  linkedin: "linkedin.com/in/your-profile",
  github: "github.com/your-username",
  // ...
}
```

The `AboutContent` component reads from this file, as do the Terminal `whoami` and `contact` commands.

### Projects

Edit `data/projects.ts`. Each project object:

```ts
{
  name: "Project Name",
  tech: ["Next.js", "TypeScript", "Tailwind CSS"],
  desc: "Description of the project",
  color: "#0d4f3c",       // background tint
  accent: "#34d399",       // accent color for highlights
  period: "Jan 2025 - Present",
  metrics: ["8 Modules", "Zero Defects"],
  context: "A short tagline",
  url: "/api/proxy/global-bush",  // optional: live preview URL
  github: "https://github.com/...", // optional: source code
  type: "web",              // "web" | "mobile" | "api"
  isCompany: true,           // hides GitHub link
}
```

**For live website previews** (type: "web" with a `url`), add the target to the proxy registry (see [Proxy System](#proxy-system)).

### Skills

Edit `data/skills.ts`. Each skill category:

```ts
{
  cat: "Category Name",
  level: 92,                  // 0-100 proficiency bar
  icon: React.createElement(FiCpu),
  items: ["Skill 1", "Skill 2", "Skill 3"],
}
```

### Contact

The contact form reads from `data/about.ts` and displays your email, LinkedIn, GitHub, and X/Twitter. The form opens the user's email client — no backend required.

### Themes & Colors

Four built-in themes controlled by CSS custom properties in `app/globals.css`:

| Theme | `data-theme` attribute | Look |
|---|---|---|
| Dark | `"dark"` (default) | Dark blue-gray |
| Matrix | `"matrix"` | Black + green #00ff41 |
| Retro | `"retro"` | Blue + yellow, Win95-style |
| Light | `"light"` | White background |

Switch themes via the terminal: `theme dark`, `theme matrix`, `theme retro`, `theme light`.

The accent color (green by default) can be changed in `stores/appStore.ts` (`accentColor: "#34d399"`) or through the Settings window.

### Dock Apps

Edit `data/dockApps.ts`:

```ts
export const DOCK_APPS: DockApp[] = [
  { id: "about", icon: <FiUser />, label: "About" },
  { id: "projects", icon: <FiFolder />, label: "Projects" },
  // ...
]
```

To add a new dock app, also:
1. Add a window config in `data/windowConfigs.ts`
2. Create a content component in `components/os/`
3. Register it in `components/os/WindowContent.tsx`

### Terminal Commands

Commands are defined in `data/commands.ts`. The `buildCommands` function returns a `Map<string, Command>`. To add a new command:

```ts
reg({
  name: "your-command",
  desc: "Description shown in help",
  usage: "your-command [args]",
  handler(args) {
    return lines("Hello from your command!")
  },
})
```

### Wallpaper

The default wallpaper is a CSS gradient defined in `data/wallpaper.ts`. Users can change it via the right-click context menu or the Settings window. Custom images are stored as data URLs in localStorage.

---

## Architecture

### Component Tree

```
PortfolioOS (app/page.tsx)
├── Starfield                    ← Animated stars in background
├── MenuBar                      ← Clock, date, dropdown menus
├── BootOverlay                  ← BIOS boot sequence animation
├── WelcomeOverlay               ← "Click an app to start"
├── [Window] × N                 ← Draggable windows
│   ├── Title bar (traffic lights)
│   ├── WindowContent            ← Routes id → content component
│   │   ├── AboutContent
│   │   ├── ProjectsContent
│   │   ├── SkillsContent
│   │   ├── ContactContent
│   │   ├── TerminalContent
│   │   ├── SettingsContent
│   │   ├── AboutOSContent
│   │   ├── PdfViewerContent
│   │   ├── SourceViewerContent
│   │   └── SnippingToolContent
│   └── "View Source" button     ← Opens source-viewer
├── Dock                         ← App launcher
│   └── DockItem × N
├── Spotlight                    ← Command+K search overlay
├── ContextMenu                  ← Right-click menu
├── WallpaperPicker              ← Wallpaper selector modal
└── FileInfoModal                ← Dropped file info
```

### State Management

All state lives in Zustand stores under `stores/`:

| Store | State | Persisted |
|---|---|---|
| `appStore` | Windows, z-index, desktop items, theme, accent color, VFS | Yes |
| `terminalStore` | Terminal lines, command history | Yes |

The stores use `zustand/middleware/persist` with `localStorage` storage key `portfolio-app-state` and `portfolio-terminal-state`.

### Window Lifecycle

1. **Open** — Click DockItem → `PortfolioOS.openWindow(id)` computes centered position with cascade offset, creates `WindowState` in store
2. **Focus** — Click on window → `focusWindow(id)` bumps its `z` above all others
3. **Drag** — `Window.onMouseDown` registers global listeners, clamps to desktop bounds
4. **Minimize** — Sets `minimized: true` → window returns `null`, dock indicator removed
5. **Close** — Deletes entry from store → component unmounts

---

## Proxy System

The portfolio can embed live websites inside project cards using a built-in reverse proxy. This bypasses CORS and `X-Frame-Options` restrictions that would normally block iframe embedding.

### How It Works

```
Browser loads:
  <iframe src="/api/proxy/global-bush">

Server fetches:
  GET https://globalbushtratour.com
  → Rewrites all relative URLs (href, src, srcset) to /api/proxy/global-bush/...
  → Returns modified HTML

Browser then loads subresources via:
  /api/proxy/global-bush/_next/static/css/...
  /api/proxy/global-bush/images/hero.webp
  → Server proxies each request to the upstream origin
```

### Adding a New Proxy Target

1. Add the entry in `data/proxyConfig.ts`:
   ```ts
   export const PROXY_ROUTES = {
     "global-bush": "https://globalbushtratour.com",
     "your-project": "https://example.com",
   }
   ```

2. Set the project URL in `data/projects.ts`:
   ```ts
   url: "/api/proxy/your-project",
   type: "web",
   ```

No route files need to be created — the `[slug]` dynamic routes handle all targets automatically.

### Route Architecture

| Route | Handler |
|---|---|
| `GET /api/proxy/[slug]` | Fetches upstream HTML, rewrites relative URLs, returns with `Content-Type: text/html` |
| `GET /api/proxy/[slug]/[...path]` | Proxies subresource requests (CSS, JS, images, fonts) with correct `Content-Type` |

---

## Building From Scratch

If you want to build your own OS-themed portfolio from scratch:

### 1. Scaffold

```bash
npx create-next-app@latest my-portfolio --typescript --tailwind --eslint
cd my-portfolio
npm install zustand react-icons react-pdf html2canvas
```

### 2. Start with the Shell

Create `PortfolioOS` as the root component. This manages:
- A full-screen container with background
- Window state (open/close/minimize/focus/z-index)
- The dock and menu bar

### 3. Implement the Window System

- `Window` component: draggable title bar, traffic light buttons (close/minimize/maximize), resize, z-index management
- Store window state in Zustand so it persists across interactions
- Use `position: absolute` for overlapping windows

### 4. Add the Dock

- `DockItem` renders an icon with hover tooltip and bounce animation
- Clicking opens/focuses/minimizes a window
- Green dot indicates open windows

### 5. Build Content Components

Each app (About, Projects, Skills, Contact, Terminal) is a separate component routed by `WindowContent`:

```tsx
// WindowContent.tsx
switch (id) {
  case "about": return <AboutContent />
  case "projects": return <ProjectsContent />
  // ...
}
```

### 6. Add the Terminal

- Read-only mode with boot script (`data/terminalLines.ts`)
- Interactive mode with command registry (`data/commands.ts`)
- Command history with ↑↓ navigation
- Tab autocomplete

### 7. Add the Proxy Tunnel

- Dynamic route `app/api/proxy/[slug]/route.ts` fetches upstream HTML
- Rewrites relative URLs so subresources load through the same origin
- Catch-all route `[...path]` proxies CSS, JS, images

### 8. Polish

- Boot animation, Spotlight search, themes, wallpaper picker, mobile responsiveness

---

## Project Structure

```
├── app/
│   ├── layout.tsx                  # Root layout (fonts, globals.css)
│   ├── page.tsx                    # Entry point → <PortfolioOS />
│   ├── globals.css                 # Tailwind v4 imports + CSS variables
│   └── api/
│       ├── fortune/route.ts        # Random advice API endpoint
│       └── proxy/[slug]/
│           ├── route.ts            # HTML proxy with URL rewriting
│           └── [...path]/route.ts  # Subresource proxy
├── components/os/
│   ├── PortfolioOS.tsx             # Desktop shell (window manager, dock, menus)
│   ├── Window.tsx                  # Draggable/resizable window frame
│   ├── WindowContent.tsx           # Routes id → content component
│   ├── DockItem.tsx                # Dock icon with tooltip + indicator
│   ├── MenuBar.tsx                 # Top bar with clock + dropdowns
│   ├── DesktopIcons.tsx            # Desktop shortcuts (drag-and-drop)
│   ├── BootOverlay.tsx             # BIOS boot animation
│   ├── WelcomeOverlay.tsx          # "Click an app to start" hint
│   ├── Spotlight.tsx               # ⌘K global search
│   ├── ContextMenu.tsx             # Right-click menu
│   ├── WallpaperPicker.tsx         # Wallpaper selection modal
│   ├── FileInfoModal.tsx           # Dropped file inspector
│   ├── TerminalContent.tsx         # Interactive bash emulator
│   ├── ProjectsContent.tsx         # Project viewer with iframe preview
│   ├── SkillsContent.tsx           # Skill matrix
│   ├── ContactContent.tsx          # Contact form + social links
│   ├── SettingsContent.tsx         # Theme + accent color settings
│   ├── AboutContent.tsx            # Profile card
│   ├── AboutOSContent.tsx          # About this system
│   ├── PdfViewerContent.tsx        # Resume PDF viewer
│   ├── SourceViewerContent.tsx     # Live source code inspector
│   ├── SnippingToolContent.tsx     # Screenshot capture tool
│   └── Starfield.tsx              # Animated background stars
├── data/
│   ├── about.ts                    # Personal info, resume, experience
│   ├── projects.ts                 # Project portfolio entries
│   ├── skills.ts                   # Skill categories + proficiency
│   ├── dockApps.ts                 # Dock app definitions
│   ├── windowConfigs.ts            # Window size/title/content mapping
│   ├── proxyConfig.ts              # Proxy tunnel registry
│   ├── commands.ts                 # Terminal command handlers
│   ├── terminalLines.ts            # Boot script lines
│   ├── wallpaper.ts               # Default wallpaper CSS
│   └── initialVfs.ts              # Virtual filesystem seed data
├── stores/
│   ├── appStore.ts                 # Zustand store: windows, theme, VFS
│   └── terminalStore.ts            # Zustand store: terminal lines, history
├── hooks/
│   ├── useTime.ts                  # Live clock (updates every second)
│   └── useWallpaper.ts            # Wallpaper state + localStorage
├── types/
│   └── portfolio.ts                # All TypeScript interfaces
├── public/
│   └── pdf.worker.min.mjs          # PDF.js worker for resume viewer
├── next.config.ts                  # Next.js config (headers, rewrites)
├── postcss.config.mjs              # PostCSS with @tailwindcss/postcss
└── tsconfig.json                   # TypeScript (strict mode)
```

---

## Deployment

### Vercel (Recommended)

```bash
npm run build
npx vercel --prod
```

No special configuration needed — the dynamic proxy routes work out of the box on Vercel's edge network.

### Manual Build

```bash
npm run build    # Outputs to .next/
npm run start    # Serves on http://localhost:3000
```

The proxy tunnel fetches external sites server-side, so it works behind any Node.js host.

### Environment Variables

None required. The portfolio has no external API dependencies — all data is static.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build (TypeScript check + optimization) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## License

MIT — free to use, modify, and distribute. If you build something cool with this, attribution is appreciated but not required.
