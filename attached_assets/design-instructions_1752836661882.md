# Design Implementation Guide - Tiny Strength Manager

## Core Design Rules
1. **Less is more** - Every word must earn its place
2. **White space is not empty space** - Use it generously
3. **One primary action per screen** - Don't overwhelm users

## Colors (CSS Variables)
```css
:root {
  --bg-primary: #F5F0E8;
  --text-primary: #1A1A1A;
  --accent-yellow: #FFD60A;
  --accent-blue: #003566;
  --text-secondary: #4A4A4A;
  --white: #FFFFFF;
}
```

## Typography Rules
```css
/* Hero Headlines */
font-size: clamp(48px, 8vw, 80px);
font-weight: 900;
letter-spacing: -2px;
line-height: 1.1;

/* Section Headers */
font-size: clamp(32px, 5vw, 48px);
font-weight: 700;
letter-spacing: -1px;

/* Body Text */
font-size: 18px;
font-weight: 400;
line-height: 1.7;
color: var(--text-secondary);

/* Small Text */
font-size: 16px;
line-height: 1.6;
```

## Content Length Limits
- **Headlines**: 3-6 words maximum
- **Subheadlines**: 10-15 words maximum  
- **Body paragraphs**: 2-3 sentences maximum
- **Button text**: 2-4 words
- **Feature descriptions**: 15-25 words

## Component Templates

### Primary Button
```jsx
<button className="bg-gray-900 text-[#F5F0E8] px-10 py-4 rounded-full font-semibold text-lg hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
  Get Started
</button>
```

### Feature Card
```jsx
<div className="bg-white p-12 rounded-2xl hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
  <div className="text-6xl font-black text-[#FFD60A] mb-4">01</div>
  <h3 className="text-2xl font-bold mb-4">[4-6 word headline]</h3>
  <p className="text-gray-600">[15-25 word description]</p>
</div>
```

### Section Container
```jsx
<section className="py-20 md:py-32 px-5 md:px-10">
  <div className="max-w-6xl mx-auto">
    <!-- Content -->
  </div>
</section>
```

## Layout Rules

### Spacing Scale
- **XS**: 8px (0.5rem)
- **S**: 16px (1rem)
- **M**: 32px (2rem)
- **L**: 64px (4rem)
- **XL**: 128px (8rem)

### Grid Structure
- **Desktop**: 12-column grid, 80px gap
- **Tablet**: 8-column grid, 40px gap
- **Mobile**: 4-column grid, 20px gap

### Breakpoints
```css
/* Mobile First */
/* Default: 0-767px */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

## Animation Rules
```css
/* Standard Transition */
transition: all 0.3s ease;

/* Hover Lift */
hover:-translate-y-2

/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
animation: fadeIn 0.6s ease-out;
```

## Don'ts
- ❌ No drop shadows except on hover
- ❌ No gradients except subtle overlays
- ❌ No more than 2 font weights per component
- ❌ No centered body text (only headlines)
- ❌ No more than 3 colors per component
- ❌ No animations longer than 0.5s
- ❌ No more than one CTA per section

## Mobile Modifications
```css
/* Reduce all spacing by 50% on mobile */
/* Stack all elements vertically */
/* Increase touch targets to 44px minimum */
/* Hide secondary navigation items */
/* Reduce font sizes by 20% */
```

## Copy Voice
- **Active voice**: "Transform your team" not "Your team will be transformed"
- **Direct address**: Use "you" and "your"
- **Present tense**: "Get insights" not "You will get insights"
- **No jargon**: Simple words over complex ones

## Image Guidelines
- Prefer geometric shapes and patterns over photos
- Use SVG for icons and illustrations
- Lazy load all images below the fold
- Max image size: 200KB

## Quick Reference
Every component should:
1. Have generous padding (min 32px)
2. Use only colors from the palette
3. Include hover state
4. Be keyboard accessible
5. Work on mobile without horizontal scroll