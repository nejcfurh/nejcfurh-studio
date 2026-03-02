# Reusable Components Library

A collection of modern, interactive React components built with Next.js 16, TypeScript, and Tailwind CSS. This library showcases various UI patterns and animations that can be easily integrated into your projects.

## 🚀 Features

- **Next.js 16** with App Router
- **React 19** with the latest features
- **TypeScript** for type safety
- **Tailwind CSS v4** for modern styling
- **Dark mode** support
- **Responsive design** across all components
- **Modern animations** and interactions

## 📦 Components

### 1. Drag & Drop

Interactive drag-and-drop interface with customizable widgets and drop areas.

- **Path**: `/drap-drop`
- **Features**: Drag widgets between areas, smooth animations, visual feedback

### 2. File Upload

Modern file upload component with drag-and-drop support.

- **Path**: `/file-upload`
- **Features**: Dropzone interface, file preview, drag-and-drop support

### 3. Input Fields

Collection of beautifully styled text input fields with various animations.

- **Path**: `/input-fields`
- **Features**: Floating labels, modern styling, multiple variants

### 4. Media Slider

Angled media slider with smooth transitions and hover effects.

- **Path**: `/media-slider`
- **Features**: Image slider, angled design, hover animations

### 5. Scroll Animation

Scroll-triggered animations with image reveals.

- **Path**: `/scroll-animation-page`
- **Features**: Scroll-based animations, image effects, smooth transitions

### 6. Scroll to Decrypt

Text that decrypts as you scroll through the page.

- **Path**: `/scroll-to-decrypt`
- **Features**: Character-by-character decryption, scroll-driven animation

### 7. Scroll to Unblur

Text that progressively unblurs as you scroll down the page.

- **Path**: `/scroll-to-unblur`
- **Features**: Word-by-word unblur effect, scroll-timeline API, modern gradient background
- **Browser Support**: Chrome 115+, Edge 115+ (uses CSS Scroll-Timeline API)

### 8. Social Media Buttons

Animated social media share buttons with modern styling.

- **Path**: `/social-media-buttons`
- **Features**: Email, LinkedIn, Facebook, X (Twitter) buttons with hover effects

### 9. Multi-Option Menu

Interactive menu button that expands into multiple options with smooth animations.

- **Path**: `/multi-option-menu`
- **Features**:
  - Two layout variants (circular and horizontal)
  - Smooth expand/collapse animations
  - SVG filter effects for visual enhancement
  - Customizable menu items
  - Click-outside-to-close functionality
  - Modern glassmorphism design
    **Inspired by and adapted from**: [Lukas Bebber](https://css-tricks.com/gooey-effect/?utm_source=bonobopress&utm_medium=newsletter&utm_campaign=2093)

### 10. Transforming Cards

Dynamic card scanner effect with particle systems and real-time transformations. Cards transition from normal to ASCII art as they pass through a particle beam scanner.

- **Path**: `/transforming-cards`
- **Features**:
  - Real-time card clipping and transformation during drag
  - Dual particle systems (Three.js background particles + canvas scanner beam)
  - Dynamic particle intensity (800 → 2500 particles when scanning)
  - Multi-layered glow effects with smooth transitions
  - Draggable card stream with momentum physics
  - ASCII art generation from card images
  - Scan effects with visual feedback
  - Adjustable velocity and direction controls
- **Technologies**: Three.js for 3D particles, Canvas API for scanner effects, React 19 hooks
- **Inspired by and adapted from**: [Evervault](https://evervault.com/)

### 11. Layered Parallax

Multi-layered parallax scrolling effect with depth-based movement. Images move at different speeds based on their layer depth, creating an immersive 3D scrolling experience.

- **Path**: `/layered-parallax`
- **Features**:
  - Multiple parallax layers with configurable depth
  - Smooth mouse tracking and movement
  - Depth-based scaling and translation
  - Responsive design with automatic layer positioning
  - Performance-optimized with transform3d
  - Customizable layer images and positions
- **Technologies**: Framer Motion for animations, React hooks for mouse tracking
- **Inspired by and adapted from**: Classic parallax scrolling techniques

### 12. Tilt Card

Interactive 3D holographic card with mouse/touch tracking and flip animation. Features a stunning holographic refraction effect that follows the cursor and displays tech stack on the rear.

- **Path**: `/tilt-card`
- **Features**:
  - 3D tilt effect following mouse/touch movement
  - Holographic color-dodge refraction overlay
  - Smooth card flip animation (front to rear)
  - Tech stack display with animated grid on rear
  - Touch support for mobile devices
  - Hardware-accelerated animations
  - Responsive sizing for mobile and desktop
  - Dynamic spotlight and glare effects
- **Technologies**: Framer Motion for 3D transforms and animations, React hooks for gesture tracking
- **Inspired by and adapted from**: [Jhey Tompkins](https://twitter.com/jh3yy)

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun

## 📁 Project Structure

```
reusable-components/
├── app/                         # Next.js App Router
│   ├── drap-drop/               # Drag & Drop component
│   ├── file-upload/             # File Upload component
│   ├── input-fields/            # Input Fields component
│   ├── media-slider/            # Media Slider component
│   ├── multi-option-menu/       # Multi-Option Menu component
│   ├── scroll-animation-page/   # Scroll Animation component
│   ├── scroll-to-decrypt/       # Scroll to Decrypt component
│   ├── scroll-to-unblur/        # Scroll to Unblur component
│   ├── social-media-buttons/    # Social Media Buttons component
│   ├── transforming-cards/      # Transforming Cards component
│   ├── layered-parallax/        # Layered Parallax component
│   ├── tilt-card/               # 3D Tiltilng Card component
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page with component gallery
├── components/                  # Shared/reusable components
│   ├── animation-core/          # Core animation components
│   │   ├── AnimatedBackgroundGradient.tsx
│   │   ├── AnimatedDiv.tsx
│   │   ├── AnimatedText.tsx
│   │   ├── AnimatedTitle.tsx
│   │   ├── FloatingOrb.tsx
│   │   └── ...
│   ├── buttons/                 # Reusable button components
│   │   ├── BackButton.tsx
│   │   └── CustomLinkButton.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── Tooltip.tsx
├── features/                    # Feature-specific logic
│   ├── file-upload/             # File upload utilities & types
│   ├── media-slider/            # Media slider constants & types
│   ├── multi-option-button/     # Multi-option menu config
│   ├── scroll-to-unblur/        # Scroll unblur utilities
│   ├── social-media-buttons/    # Social buttons config
│   ├── layered-parallax/        # Layered parallax config
│   ├── tilt-card/               # Tilt card config
│   └── transforming-cards/      # Card transformation logic
├── hooks/                       # Custom React hooks
├── constants/                   # Global constants
│   └── constants.tsx
├── utils/                       # Utility functions
│   ├── types.ts
│   └── utils.ts
├── validation/                  # Validation schemas
├── config/                      # Configuration files
├── public/                      # Static assets
│   └── images/                  # Image files
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

## 🎨 Technologies Used

- **Next.js 16.0.1** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Icons 5.5.0** - Icon library
- **Three.js** - 3D graphics and particle systems
- **Canvas API** - 2D graphics and animations
- **CSS Scroll-Timeline API** - For scroll-driven animations

## 📄 License

This project is free to use.
