# Design & Development Plan

## QuantumMint Bookstore - Sierra Books

---

## 🎨 Design Philosophy

### Core Principles

**1. Premium First Impressions**

- Modern, vibrant aesthetic that wows users immediately
- Dark mode as default with rich gradients
- Glassmorphism effects for depth and sophistication
- Smooth micro-animations for enhanced UX

**2. Localization**

- SLL (Sierra Leone Leones) as primary currency
- USD equivalents for international context
- Mobile money payment prominence (Orange Money, Afrimoney, Qmoney)

**3. Accessibility**

- Clear visual hierarchy
- Readable typography (16px minimum)
- High contrast ratios
- Keyboard navigation support

---

## 🎭 Visual Design System

### Color Palette

**Primary Colors:**

```css
--primary-purple: #9333ea
--primary-pink: #ec4899
--gradient-primary: linear-gradient(to right, #9333ea, #ec4899)
```

**Neutral Colors:**

```css
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-800: #1f2937
--gray-900: #111827
```

**Semantic Colors:**

```css
--success-green: #10b981
--warning-yellow: #f59e0b
--error-red: #ef4444
--info-blue: #3b82f6
```

### Typography

**Fonts:**

- Primary: `Inter, sans-serif` (body text)
- Headings: `Inter, sans-serif` (bold weights)

**Scale:**

- Heading 1: 36px (2.25rem)
- Heading 2: 24px (1.5rem)
- Heading 3: 20px (1.25rem)
- Body: 16px (1rem)
- Small: 14px (0.875rem)
- Tiny: 12px (0.75rem)

### Spacing

Following 8px grid system:

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

---

## 🏗️ Component Architecture

### Atomic Design Structure

**Atoms:**

- Buttons (primary, secondary, ghost)
- Input fields
- Labels
- Icons
- Badges

**Molecules:**

- Search bar
- Form groups
- Card headers
- Stat cards

**Organisms:**

- Navigation bar
- Book cards
- Audio player
- Dashboard widgets

**Templates:**

- Page layouts
- Modal containers
- Grid systems

**Pages:**

- Home, Marketplace, Library, Dashboards

### Component Naming Convention

```typescript
// PascalCase for components
export function BookCard() {}

// camelCase for utilities
export function formatCurrency() {}

// UPPER_CASE for constants
export const PRICING = {}
```

---

## 💻 Development Workflow

### Tech Stack

**Frontend:**

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v3
- **Rich Text**: React Quill
- **State Management**: React hooks (useState, useContext)

**Backend (Planned):**

- Node.js + Express
- PostgreSQL database
- Redis for caching
- TTS service integration

### Folder Structure

```
src/
├── components/          # Reusable components
│   ├── AudioPlayer.tsx
│   ├── BookCard.tsx
│   ├── Layout.tsx
│   └── ...
├── pages/              # Route pages
│   ├── Home.tsx
│   ├── Marketplace.tsx
│   ├── CreatorDashboard.tsx
│   └── ...
├── utils/              # Utilities
│   ├── api.ts
│   └── helpers.ts
├── types.ts            # TypeScript types
├── index.css           # Global styles
└── App.tsx             # Router config
```

### Git Workflow

**Branching Strategy:**

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Production fixes

**Commit Convention:**

```
feat: Add Orange Money integration
fix: Resolve subscription badge display
docs: Update payment systems documentation
style: Apply glassmorphism to cards
refactor: Extract payment logic to utilities
test: Add unit tests for UsageTracker
chore: Update dependencies
```

---

## 📐 Design Patterns

### Component Patterns

**1. Container/Presenter Pattern**

```typescript
// Container (logic)
function BookDetailContainer() {
  const [book, setBook] = useState<Book | null>(null);
  // ... fetch logic
  return <BookDetailPresenter book={book} />;
}

// Presenter (UI only)
function BookDetailPresenter({ book }: { book: Book }) {
  return <div>{/* UI */}</div>;
}
```

**2. Custom Hooks**

```typescript
// Reusable logic
function useUsageTracker() {
  const [sessionCost, setSessionCost] = useState(0);
  // ... tracking logic
  return { sessionCost, /* ... */ };
}
```

**3. Compound Components**

```typescript
// AudioPlayer with sub-components
<AudioPlayer>
  <AudioPlayer.Controls />
  <AudioPlayer.ProgressBar />
  <AudioPlayer.ChapterList />
</AudioPlayer>
```

### State Management

**Local State:**

- UI toggles (modals, dropdowns)
- Form inputs
- Component-specific data

**Global State (Context):**

- User authentication
- Current subscription status
- Theme preferences

---

## 🧪 Testing Strategy

### Unit Tests

**Tools:** Jest + React Testing Library

**Coverage:**

- Components: 80%+ coverage
- Utilities: 90%+ coverage
- Types: 100% coverage

**Example:**

```typescript
test('UsageTracker calculates SLL cost correctly', () => {
  const { result } = renderHook(() => useUsageTracker());
  // Test implementation
});
```

### Integration Tests

**Focus Areas:**

- API communication
- Payment flows
- Subscription management
- Dashboard data aggregation

### E2E Tests

**Tools:** Playwright or Cypress

**Critical Flows:**

1. User registration → Browse → Listen → Subscribe
2. Creator registration → Create book → Publish → View earnings
3. Support staff → View tickets → Resolve issue
4. Admin → Monitor platform → Moderate content

---

## 🚀 Performance Optimization

### Code Splitting

```typescript
// Lazy load heavy components
const CreatorDashboard = lazy(() => import('./pages/CreatorDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
```

### Image Optimization

- WebP format for modern browsers
- Lazy loading with `loading="lazy"`
- Responsive images with `srcset`
- CDN delivery for static assets

### Bundle Optimization

**Vite Configuration:**

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
        }
      }
    }
  }
});
```

### Caching Strategy

- Service workers for offline access
- Local storage for user preferences
- IndexedDB for listening history
- HTTP caching headers

---

## 🔒 Security Considerations

### Frontend Security

**1. XSS Prevention**

- Sanitize user inputs (React Quill content)
- CSP headers in production
- Avoid `dangerouslySetInnerHTML`

**2. Authentication**

- JWT tokens with short expiry
- Refresh token rotation
- HttpOnly cookies for tokens

**3. Payment Security**

- Never store card details
- PCI DSS compliance via Stripe
- SSL/TLS for all transactions
- 2FA for sensitive operations

### Data Validation

```typescript
// Input validation
const validateBookTitle = (title: string) => {
  if (!title || title.length < 3) {
    return 'Title must be at least 3 characters';
  }
  if (title.length > 100) {
    return 'Title must be less than 100 characters';
  }
  return null;
};
```

---

## ♿ Accessibility (a11y)

### WCAG 2.1 AA Compliance

**Keyboard Navigation:**

- All interactive elements focusable
- Visible focus indicators
- Logical tab order

**Screen Readers:**

- Semantic HTML (`<nav>`, `<main>`, `<article>`)
- ARIA labels for icons
- Alt text for images

**Color Contrast:**

- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text
- Color not sole indicator

**Implementation:**

```tsx
<button
  aria-label="Play audiobook"
  className="focus:ring-2 focus:ring-purple-500"
>
  <PlayIcon aria-hidden="true" />
</button>
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile first approach */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Mobile Optimizations

- Touch-friendly tap targets (44x44px minimum)
- Swipe gestures for navigation
- Bottom navigation for key actions
- Simplified layouts on small screens

---

## 🎯 Design Patterns for Revenue

### Pricing Display

**Always show dual currency:**

```tsx
<div className="price">
  <span className="sll">Le {amountSLL}</span>
  <span className="usd">(${amountUSD} USD)</span>
</div>
```

### Revenue Split Visualization

```tsx
// 75/25 split display
<div className="revenue-split">
  <div className="creator-share" style={{ width: '75%' }}>
    Creators: Le 382.50
  </div>
  <div className="platform-share" style={{ width: '25%' }}>
    Platform: Le 127.50
  </div>
</div>
```

### Payment Method Selection

**Priority Order:**

1. Qmoney (lowest fees - 1%)
2. Afrimoney (1.5% fees)
3. Orange Money (2% fees)  
4. Stripe (5% platform fee, international)

---

## 📊 Analytics & Monitoring

### User Analytics

**Track:**

- Page views
- Time on site
- Listening sessions
- Conversion rates (browse → subscribe)
- Payment method preferences

**Tools:**

- Google Analytics 4
- Custom event tracking
- Heatmaps (Hotjar)

### Performance Monitoring

**Metrics:**

- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.8s
- Cumulative Layout Shift (CLS) < 0.1

**Tools:**

- Lighthouse CI
- Web Vitals monitoring
- Sentry for error tracking

---

## 🔄 CI/CD Pipeline

### Automated Checks

**On Pull Request:**

1. TypeScript compilation
2. ESLint checks
3. Unit tests
4. Build verification
5. Bundle size check

**On Merge to Main:**

1. All PR checks
2. Integration tests
3. E2E tests
4. Deploy to staging
5. Smoke tests
6. Deploy to production

---

## 📝 Documentation Standards

### Code Comments

```typescript
/**
 * Calculates the cost for a listening session in SLL
 * @param durationMinutes - Session duration in minutes
 * @param isSubscribed - Whether user has active subscription
 * @returns Session cost in SLL, or 0 if subscribed
 */
function calculateSessionCost(
  durationMinutes: number,
  isSubscribed: boolean
): number {
  if (isSubscribed) return 0;
  return durationMinutes * PRICING.payPerUse.perMinuteSLL;
}
```

### Component Documentation

```tsx
/**
 * AudioPlayer component with usage tracking
 * 
 * Features:
 * - Play/pause controls
 * - Chapter navigation
 * - Speed/volume adjustment
 * - Real-time cost tracking (pay-per-use)
 * - Subscription badge display
 * 
 * @example
 * <AudioPlayer 
 *   bookId="123" 
 *   chapters={chapters}
 *   onSessionEnd={handleSessionEnd}
 * />
 */
```

---

## 🎓 Best Practices

### React Best Practices

1. **Use TypeScript strictly** - No `any` types
2. **Functional components** - No class components
3. **Custom hooks** - Extract reusable logic
4. **Memoization** - Use `useMemo` and `useCallback` for expensive operations
5. **Error boundaries** - Catch component errors gracefully

### CSS Best Practices

1. **Mobile-first** - Start with mobile styles, add desktop
2. **Utility classes** - Prefer Tailwind utilities over custom CSS
3. **Consistent spacing** - Use 8px grid system
4. **Dark mode** - Design for dark mode first
5. **Animations** - Subtle and meaningful, < 300ms

### Performance Best Practices

1. **Code splitting** - Lazy load routes
2. **Image optimization** - WebP, lazy loading, responsive
3. **Debounce inputs** - Reduce API calls
4. **Virtual scrolling** - For long lists
5. **Caching** - Cache API responses

---

## 🚧 Known Limitations & Future Improvements

### Current Limitations

- Mock data for all dashboards
- No real authentication
- No actual payment processing
- Frontend-only routing (no backend)

### Planned Improvements

**Short-term (1-3 months):**

- Backend API integration
- Real authentication (JWT)
- Orange Money/Afrimoney integration
- Database setup

**Medium-term (3-6 months):**

- Mobile app (React Native)
- Offline listening
- Advanced analytics
- Multi-language support

**Long-term (6-12 months):**

- AI-powered recommendations
- Social features (sharing, playlists)
- Creator collaboration tools
- Advanced TTS customization

---

## 📚 Resources & References

**Design:**

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Design Patterns](https://reactpatterns.com)
- [Glassmorphism Generator](https://hype4.academy/tools/glassmorphism-generator)

**Development:**

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

**Accessibility:**

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

**Payment Integration:**

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- Orange Money API docs
- Qmoney developer portal

---

## ✅ Success Criteria

**Design Excellence:**

- [ ] Modern, premium aesthetic achieved
- [ ] Glassmorphism effects implemented
- [ ] Dark mode as default
- [ ] Smooth animations throughout

**Functionality:**

- [ ] All 4 dashboards working
- [ ] SLL currency integrated
- [ ] Payment methods documented
- [ ] User roles defined

**Performance:**

- [ ] LCP < 2.5s
- [ ] FCP < 1.8s
- [ ] Bundle size < 500KB

**Accessibility:**

- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader support

**Code Quality:**

- [ ] 80%+ test coverage
- [ ] No TypeScript errors
- [ ] ESLint passing
- [ ] Documentation complete
