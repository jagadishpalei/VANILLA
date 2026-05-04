# 🍦 VANILLA — Full Implementation Plan
### Luxury Restaurant Website · Built from Scratch

---

## 🧭 Overview

A dark-themed, cinematic, premium restaurant website for **Vanilla** — a luxury dining brand. The design philosophy is **Quiet Luxury**: charcoal backgrounds, matte orange accents, warm off-white text, editorial layouts, and smooth framer-motion animations.

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | **React 18** via **Vite** |
| Routing | **React Router DOM v6** |
| Animation | **Framer Motion** |
| Icons | **Lucide React** |
| Fonts | Google Fonts — Playfair Display + Inter |
| Styling | **Vanilla CSS** (no Tailwind) |
| Images | `.avif` / `.png` served from `/public` |
| Build | `npm run build` → `/dist` |

---

## 📁 File & Folder Structure

```
vanilla/
├── public/
│   ├── logo3.png               ← Navbar logo
│   ├── logo6.png               ← Why Us section logo
│   └── images/
│       ├── categories/         ← AI-generated category covers
│       ├── burger/
│       ├── pizza/
│       ├── wrap/
│       ├── pasta/
│       ├── sandwich/
│       ├── cheesecake/
│       ├── coffee/
│       ├── shake/
│       ├── pastries/
│       ├── fries/
│       ├── dessert/
│       └── mocktail/
│
├── src/
│   ├── App.jsx                 ← Root router + layout
│   ├── App.css                 ← Global styles + Navbar CSS
│   ├── main.jsx                ← Vite entry point
│   │
│   ├── components/
│   │   └── Navbar.jsx          ← Fixed global navbar
│   │
│   ├── data/
│   │   └── menuData.js         ← All categories + items + descriptions
│   │
│   └── pages/
│       ├── Home.jsx            ← Landing page (all sections)
│       ├── Home.css            ← Section styles (Why Us, Contact, etc.)
│       ├── MenuCategories.jsx  ← /menu → cinematic category grid
│       ├── MenuSubCategory.jsx ← /menu/:id → editorial item list
│       └── Menu.css            ← All menu + subcategory styles
│
└── index.html
```

---

## 🎨 Design System (CSS Variables)

Defined in `Home.css` `:root`:

```css
--charcoal:       #1C1C1E    /* Main background */
--charcoal-light: #252528    /* Section alt background */
--charcoal-mid:   #2E2E32    /* Form inputs */
--charcoal-card:  #222225    /* Card backgrounds */
--orange:         #D4621A    /* Matte warm orange accent */
--orange-muted:   #C05A15    /* Hover state orange */
--orange-glow:    rgba(212,98,26,0.15)
--orange-border:  rgba(212,98,26,0.3)
--white:          #F5F2ED    /* Warm off-white text */
--white-soft:     rgba(245,242,237,0.85)
--white-dim:      rgba(245,242,237,0.45)
--white-ghost:    rgba(245,242,237,0.08)
--divider:        rgba(245,242,237,0.08)
```

**Typography:**
- Headings → `Playfair Display`, weight 300–400
- Body / UI → `Inter`, weight 300–500
- Letter spacing → generous (0.1em–0.45em on small caps)

---

## 🗂️ Data Layer — `menuData.js`

Each category object:
```js
{
  id: "burgers",
  title: "Burgers",
  image: "/images/categories/premium_burger.png",  // AI-generated cover
  items: [
    {
      name: "Crispy Chicken Burger",
      image: "/images/burger/crispy.avif",          // Real food photo
      desc: "Golden-fried chicken with a perfectly seasoned crust...",
      tag: "Popular"   // Optional: Chef's Special | Spicy | Classic | etc.
    },
    ...
  ]
}
```

**12 Categories total:**
Burgers · Pizza · Wraps · Pasta & Sides · Sandwiches · Cheesecakes · Coffee · Shakes · Pastries · Fries & Snacks · Desserts · Mocktails

**80+ menu items**, each with unique AI-generated descriptions.

---

## 🧩 Components

### `Navbar.jsx`
- Fixed top, glassmorphism (`backdrop-filter: blur(20px)`)
- **Smart Scroll Logic**: Automatically hides on scroll down (maximize space) and reappears on scroll up (easy navigation).
- Logo: circular white frame + "VANILLA" text in Inter 300
- Nav links: uppercase, spaced, orange underline on hover
- Scrolled state: darker + tighter padding

### `MobileCardStack` (Sub-component in `Home.jsx`)
- **Interactive Deck**: Replaces linear list on mobile with a layered card stack.
- **Gestures**: Horizontal swipe (↔) to cycle categories + spring-physics transitions.
- **Depth System**: Main card + 2 "ghost" cards with progressive scaling, opacity, and blur.
- **Expandable**: Tap-to-expand reveal for submenu previews and "View Full Menu" CTA.

### `RevealSection` (utility in `Home.jsx`)
- Wrapper using `framer-motion` + `useInView`
- Fades + slides up on scroll (`opacity 0→1`, `y 60→0`)
- `once: true` — triggers only once

---

## 📄 Pages

---

### 1. `Home.jsx` — Landing Page

**Section 1: Hero**
- Full viewport (`100vh`), `#1C1C1E` background
- Two floating food images (left/right, blurred, animated)
- Centre: `VANILLA` title in Playfair 300, enormous
- Tagline in Inter spaced caps
- CTA button: transparent border → orange fill on hover
- Scroll indicator: animated pill + dot

**Section 2: Our Menu (Responsive Redesign)**
- **Desktop**: Hero featured card (Burgers) + asymmetric grid (4-column).
- **Mobile (MSC)**: Interactive **Stacked Card Deck** replaces the static grid.
  - Zero side padding for full-bleed cinematic feel.
  - Custom floating controls: Dots (bottom -21px) + Nav Buttons (bottom -34px).
  - Tap-to-expand submenu preview with pulse indicator.
- Image: `brightness(0.85) saturate(0.88)` cinematic filter.

**Section 3: Why Us**
- `charcoal-light` background
- `logo6.png` logo centered, pulsing animation
- 3–4 feature cards: dark bg, orange icon, Playfair title
- Hover: lift + orange border glow

**Section 4: Reviews**
- `charcoal-light` background
- Cards: dark bg, orange stars
- Google Reviews CTA button (outlined orange)

**Section 5: Contact**
- `charcoal` background
- Two-column: info left / form right
- Form inputs: dark bg, orange focus ring
- Submit button: matte orange

**Footer**
- Near-black `#131315`
- Centered copyright in dim off-white

---

### 2. `MenuCategories.jsx` — `/menu`

**Layout:**
1. Page-level dark background with fixed glow orbs + noise texture
2. Header: "Our Menu" in Playfair + spaced subtitle
3. **Hero card** — full-width, 340px, Burgers as featured
   - Cinematic gradient overlay
   - "Signature" eyebrow + title + "Explore ✦" CTA
4. **Asymmetric grid** — 4 columns, 240px rows
   - Some cards span 2 rows (tall) or 2 columns (wide)
   - Each card: dark bg, image with overlay, title in lower-left
   - Hover: lift 4px, scale 1.03, subtle orange border

---

### 3. `MenuSubCategory.jsx` — `/menu/:categoryId`

**Layout:**
- Full charcoal page, navbar at top
- Back link (← Back to Menu)
- Category header: eyebrow + Playfair title + orange divider line
- **Editorial alternating list:**
  - Item 1: image LEFT (40%) · text RIGHT (60%)
  - Item 2: image RIGHT · text LEFT
  - Repeats for all items
- Each item:
  - Tag pill (orange outlined)
  - Item name (Playfair 2rem)
  - Description (Inter 0.9rem, muted)
  - Expanding orange line on hover
- Smooth `useInView` staggered fade-in
- Image hover: `scale(1.03)`, filter lift

---

## 🎬 Animation System

| Interaction | Implementation |
|---|---|
| Page entry | `motion.div` fade-in on mount |
| Scroll reveal | `useInView` + framer-motion `y: 60→0` |
| Smart Navbar | `translateY(-100%)` hide/show based on scroll direction |
| Card Stack | CSS variables for depth (`--card-scale`, `--card-blur`, `--card-ty`) |
| Card Transition | `cubic-bezier(0.34, 1.56, 0.64, 1)` spring physics |
| Stagger | `delay={index * 0.08}` |
| Card hover | CSS `transform + box-shadow` transition |
| Image zoom | CSS `scale()` on hover |
| CTA fill | `motion.div` with `x: -100%→0` |
| Logo pulse | `animate={{ scale: [1, 1.04, 1] }}` loop |
| Scroll dot | `animate={{ y: [0,12,0], opacity: [1,0,1] }}` |
| Nav underline | CSS `width: 0→100%` on hover |

---

## 📐 Layout Measurements

### Menu Category Grid
```
Desktop:  4 columns · 240px rows · 1.2rem gap
Tablet:   3 columns · 220px rows
Mobile:   2 columns · 200px rows
```

### Editorial Sub-menu
```
Desktop:  2fr image + 3fr text · 3.5rem gap · 4rem between items
Tablet:   stacked (1 column) · 1.5rem gap
Mobile:   1 column · 2.5rem between items
```

---

## 🗺️ Routing (`App.jsx`)

```jsx
<Routes>
  <Route path="/"           element={<Home />} />
  <Route path="/menu"       element={<MenuCategories />} />
  <Route path="/menu/:id"   element={<MenuSubCategory />} />
</Routes>
```

---

## 🖼️ Image Strategy

| Source | Usage |
|---|---|
| AI-generated (Imagen) | Category cover cards (cinematic dark shots) |
| Real food photos (.avif) | Sub-menu item editorial rows |

All category images stored in `/public/images/categories/`  
All item images stored in `/public/images/<category-name>/`

**Image treatment:**
- Category cards: `brightness(0.85) saturate(0.88)` + gradient overlay
- Editorial items: `brightness(0.88) saturate(0.9)`, hover lifts to 0.93

---

## ✅ Implementation Checklist

### Foundation
- [x] Vite + React project scaffolded
- [x] React Router DOM installed
- [x] Framer Motion installed
- [x] Lucide React installed
- [x] Google Fonts loaded (Playfair Display + Inter)
- [x] CSS variables defined

### Data
- [x] `menuData.js` with 12 categories
- [x] 80+ items with names, images, descriptions, tags

### Design System
- [x] Global charcoal palette applied
- [x] Matte orange accents throughout
- [x] Warm off-white text
- [x] Noise texture background
- [x] Orange glow orbs

### Navbar
- [x] Fixed glassmorphism navbar
- [x] Circular logo + VANILLA text
- [x] Orange underline hover
- [x] Scrolled state

### Home Page
- [x] Full-viewport hero
- [x] Floating food images
- [x] CTA button with fill animation
- [x] Scroll indicator
- [x] Menu categories section
- [x] Why Us section (logo6.png)
- [x] Reviews section
- [x] Contact form
- [x] Footer

### Menu Page
- [x] Cinematic hero category card
- [x] Asymmetric 4-column grid
- [x] Hover animations
- [x] Staggered reveal

### Sub-menu Page
- [x] Editorial alternating layout
- [x] 40/60 image/text split
- [x] AI descriptions + tags
- [x] Smooth scroll reveal
- [x] Back navigation

### Polish
- [x] Responsive (mobile/tablet/desktop)
- [x] Premium image filters
- [x] Reduced motion for performance
- [x] Consistent spacing rhythm

### Recent Polish & Updates (Latest Session)
- [x] Built Cinematic Horizontal-Scrolling Gallery section
- [x] Integrated EmailJS backend for Contact Form submissions
- [x] Fixed WhatsApp API deep-linking with fallback support
- [x] Fixed mobile typography scaling, line heights, and word-wrap
- [x] Refined Hero, Contact, and Menu responsive spacing
- [x] Fixed CSS cascade priority issues causing desktop styles to override mobile
- [x] Perfected "Why Us" orbital ring alignment with exact pixel math
- [x] Expanded customer reviews data
- [x] Integrated cinematic SplashScreen with logo transition to navbar
- [x] Added "Email Us" direct mailto action button in Contact page
- [x] Corrected "Our Menu" mobile heading scaling
- [x] Synchronized all local updates to GitHub repository
- [x] **Redesigned Mobile Menu**: Replaced linear list with interactive Stacked Card Deck (MSC).
- [x] **Smart Navigation**: Implemented hide-on-scroll-down / show-on-scroll-up Navbar.
- [x] **Unified Architecture**: Removed redundant hero headers; unified global Navbar across homepage.
- [x] **Gesture Optimization**: Horizontal swipe with 50px threshold + full-bleed mobile layout.
- [x] **Depth Effects**: Progressive scale/blur/opacity for stacked cards.
- [x] **UX Polishing**: Fine-tuned control positioning (dots/buttons) for mobile ergonomics.
- [x] **State Sync**: Card stack expansion state resets on navigation.

---

## 🚀 Deployment

```bash
# Development
cd f:\mamu\vanilla
npm run dev           # http://localhost:5173

# Production build
npm run build         # outputs to /dist
npm run preview       # preview production build
```

> [!TIP]
> For hosting: deploy the `/dist` folder to **Vercel**, **Netlify**, or **GitHub Pages**. All image assets in `/public` are bundled automatically.

> [!NOTE]
> The dev server (`npm run dev`) is currently running in the background. All changes hot-reload automatically via Vite HMR.

---

## 🧠 Design Philosophy Summary

> **"Quiet Luxury"** — The UI should feel like a high-end dining catalog. Not flashy, not loud. Every element earns its space. Dark, warm, breathable. Typography leads. Images support. Orange appears sparingly — only where attention is truly needed.

| Principle | Rule |
|---|---|
| Color | Charcoal bg · Matte orange accent · Warm off-white text |
| Typography | Playfair for headings · Inter for body · Never bold |
| Spacing | Generous — let elements breathe |
| Imagery | Cinematic filters · Never oversized |
| Motion | Slow + smooth · Never sudden |
| Hierarchy | Text first · Image supports |
