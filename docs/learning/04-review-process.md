# 04 - The Review Process

**Date:** 2026-03-11
**Session:** ProductsPage locator review — first complete run of the human + AI review process

---

## What We Built

A structured review process for AI-generated page objects, built step by step from experience rather than written top-down. First applied to `pages/products-page.ts`.

**Artefact produced:** `docs/artifacts/ProductsPage Locator Review.md`
- Section 1: Human inspection (manual DevTools, across multiple states)
- Section 2: AI inspection (live Playwright scrape, page load + dynamic state)
- Section 3: Final consolidated locators (agreed after comparison and Q&A)

**Review checklist produced:** `docs/concepts/review-checklist.md` — Section 1: Locators

---

## Key Learnings

### The review process must be genuinely independent
AI writing locators from memory defeats the purpose. Section 2 must come from a fresh live inspection — Claude logs in via Playwright script, scrapes all `data-test` attributes at page load, then again after state changes. Only then is it independent from Section 1.

### Human and AI catch different things
- **Human catches:** Dynamic state elements (cart badge, remove button) — because you inspect behaviour, not just page load
- **AI catches:** All structural elements, full product slug list, containers and display elements you wouldn't think to look for manually
- **Both needed.** Neither is complete alone.

### Slugs — what they are and how to use them
A slug is a URL-friendly version of a name: `"Sauce Labs Backpack"` → `sauce-labs-backpack`. SauceDemo uses them to build `data-test` values. You don't memorise them — you read them from the page or look them up in `tests/test-data/products.ts`.

### Each product has two button states — same element, different data-test
```
add-to-cart-{slug}  →  default state
remove-{slug}       →  after adding to cart
```
Captured in `PRODUCTS` as `.addToCart` and `.remove` per product — no string building at the call site.

### TDD with AI — two layers
TDD splits into behaviour (your job) and implementation (AI's job):
- You define: *"when I add the backpack to cart, the badge shows 1"*
- AI finds: the exact locators (`add-to-cart-sauce-labs-backpack`, `shopping-cart-badge`)
You never need to know locators upfront to write the test intention.

### product-sort-container is a single `<select>` element
The four sort options are `<option>` tags inside it — no separate `data-test` attributes. You interact with it by selecting an option by visible text:
```typescript
await page.getByTestId('product-sort-container').selectOption('Price (low to high)');
```

### The constructor lives inside the page object file
Not a separate file. It runs once when you create `new ProductsPage(page)` and sets up locators that are always on the page. Dynamic locators (per-product) are resolved inside methods via parameters.

### Start lean — add locators when tests need them
Per-product display elements (`inventory-item-name`, `desc`, `price`) and detail page links were found in the scrape but excluded from the page object. No current test needs them. Add when the need arises.

### Detail page = separate page object
`/inventory-item.html` is a different URL → different page object. The links to it (`item-{n}-title-link`) live in ProductsPage but only get added when a test navigates to the detail page.

### Global elements — defer the architecture decision
Sidebar links and menu toggles appear on every page after login. Don't decide the architecture (individual vs shared Header/BasePage) until you feel duplication across two or more page objects.

### Deferred decisions need a home
When a decision is consciously deferred, capture it in two places:
1. `project-context.md` — Open Questions section (surfaces in future sessions)
2. The artifact — Deferred Decisions section (traceability)

### Intellectual reasoning produces correct results early on
Experience tells you *how much pain* a wrong decision causes — you feel it when tests break. Good reasoning gets you to the right decision before the pain. The review process makes reasoning explicit and traceable.

---

## The Locator Review Checklist (v1 — Locators only)

```
- [ ] Locator uses data-test attribute via getByTestId() where available
- [ ] If no data-test, getByRole() is used instead
- [ ] If neither, a semantic fallback is used (getByLabel, getByPlaceholder, getByText, #id)
- [ ] CSS class selectors only used as last resort — flagged with a comment explaining why
- [ ] Scope is explicitly stated — checklist applies to what was decided to include, not the whole page
```

Full checklist: `docs/concepts/review-checklist.md`

---

## Sources
- `docs/artifacts/ProductsPage Locator Review.md` — the full review artefact
- `docs/concepts/review-checklist.md` — living checklist, grows with each section
- `tests/test-data/products.ts` — PRODUCTS constants with both button states per product
