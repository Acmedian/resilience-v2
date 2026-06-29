# Resilience v2

A modern mental health resilience tracking platform for defence personnel. Built with React + Vite + Tailwind CSS v3.

## Stack

- **Frontend**: React 18, Vite 6, React Router v6
- **Styling**: Tailwind CSS v3 with custom design tokens (ink, mint palette)
- **Animation**: Framer Motion
- **Charts**: Recharts + custom SparkBar/SparkLine components
- **Icons**: Lucide React

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `ink` | `#0A1628` | Primary text, backgrounds |
| `mint` | `#2DD4A0` | Brand accent, highlights |
| `mint-light` | `#E6F9F4` | Soft mint backgrounds |
| `mint-dark` | `#0D9488` | Hover states |
| `surface-soft` | `#F9FAFB` | Page background |
| `border` | `#F2F4F7` | Card borders |
| `border-strong` | `#E4E7EC` | Input borders |

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ui/           # Reusable primitives
│   │       ├── SparkBar.jsx
│   │       ├── SparkLine.jsx
│   │       ├── AnimatedNumber.jsx
│   │       ├── StatusBadge.jsx
│   │       └── Modal.jsx
│   ├── lib/
│   │   └── constants.js  # Mock data & constants
│   ├── index.css         # Global styles & component classes
│   └── main.jsx
├── tailwind.config.js
└── vite.config.js
```

## UI Primitives

- **SparkBar** — flex column mini-bar chart, mint highlight for high values
- **SparkLine** — SVG area chart with gradient fill
- **AnimatedNumber** — eased count-up animation via `requestAnimationFrame`
- **StatusBadge** — green / amber / red / mint / ghost pill variants
- **Modal** — portal-based dialog with Framer Motion scale animation + backdrop blur
