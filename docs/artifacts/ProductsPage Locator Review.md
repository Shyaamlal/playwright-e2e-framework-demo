# ProductsPage — Locator Review

Structured comparison of human and AI locator findings for `pages/products-page.ts`.
Review checklist: `docs/concepts/review-checklist.md`

---

## Section 1: Human Inspection

*Manual inspection of SauceDemo ProductsPage using Chrome DevTools. Elements inspected across multiple states (before and after adding item to cart).*

| Element | data-test | Notes |
|---------|-----------|-------|
| Cart icon (header) | `shopping-cart-link` | Navigates to cart page |
| Cart badge (item count) | `shopping-cart-badge` | Only appears after adding item — inspected after adding to cart |
| Sort dropdown | `product-sort-container` | Options: Name (A to Z), Name (Z to A), Price (low to high), Price (high to low) |
| Add to cart — Backpack | `add-to-cart-sauce-labs-backpack` | |
| Remove — Backpack | `remove-sauce-labs-backpack` | Only appears after adding item — inspected after adding to cart |

**Key insight:** Dynamic state elements (cart badge, remove button) only visible after interaction — caught by inspecting behaviour, not just page load.

---

## Section 2: AI-Generated Locators

*Fresh live inspection of SauceDemo ProductsPage — Claude logged in via Playwright script and scraped all `data-test` attributes at page load, then again after adding an item to cart to catch dynamic elements.*

### All data-test attributes found (page load state)

**Header / navigation:**
| data-test | Tag | Notes |
|-----------|-----|-------|
| `shopping-cart-link` | a | Cart icon — navigates to cart |
| `title` | span | Page title "Products" — display only |
| `active-option` | span | Currently selected sort label |
| `product-sort-container` | select | Sort dropdown |

//comment: I think header is a separate component which contains a span 'Swag Labs'. I would argue the shopping cart too, but in our case, the shopping cart is part of the page object. While we need it here, I'm unsure how it works for other applications. I'm unsure what 'product-sort-container' is. If it is the four sorting options, I imagine the options would be here as well.

**Per product (pattern × 6 products):**
| data-test | Tag | Notes |
|-----------|-----|-------|
| `inventory-item` | div | Product card container |
| `item-{n}-img-link` | a | Product image → detail page |
| `inventory-item-{slug}-img` | img | Product image |
| `item-{n}-title-link` | a | Product title → detail page |
| `inventory-item-name` | div | Product name text |
| `inventory-item-desc` | div | Product description text |
| `inventory-item-price` | div | Product price text |
| `add-to-cart-{slug}` | button | Add to cart — e.g. `add-to-cart-sauce-labs-backpack` |

//comments: This is incredible, in the sense that I can test for editorial and UI changes in the page I guess. I'm unsure the extent of locators do we need. Two specific doubts: if I did this manually, I wouldn't have thought about product card container, slug: how can I remember this. Secondly, people say that since AI is writing the code, we should do TDD, this I imagine means we write all possible ways a page/app needs to behave - if we are doing this, how do we work with precise elements like these? you were able to find because they were available in the page, right?

**All 6 products — two button states each:**

Each product button has two states — same element, different data-test value depending on cart state.

| Product | Add to cart (default state) | Remove (after adding) |
|---------|----------------------------|-----------------------|
| Backpack | `add-to-cart-sauce-labs-backpack` | `remove-sauce-labs-backpack` |
| Bike Light | `add-to-cart-sauce-labs-bike-light` | `remove-sauce-labs-bike-light` |
| Bolt T-Shirt | `add-to-cart-sauce-labs-bolt-t-shirt` | `remove-sauce-labs-bolt-t-shirt` |
| Fleece Jacket | `add-to-cart-sauce-labs-fleece-jacket` | `remove-sauce-labs-fleece-jacket` |
| Onesie | `add-to-cart-sauce-labs-onesie` | `remove-sauce-labs-onesie` |
| Red T-Shirt | `add-to-cart-test.allthethings()-t-shirt-(red)` | `remove-test.allthethings()-t-shirt-(red)` |

**Pattern:** `add-to-cart-{slug}` → `remove-{slug}`. Captured in `tests/test-data/products.ts` as `PRODUCTS.{name}.addToCart` and `PRODUCTS.{name}.remove`.

**Dynamic state (cart badge):**
| data-test | Tag | Notes |
|-----------|-----|-------|
| `shopping-cart-badge` | span | Cart item count — only appears after at least one item added |

**Out of scope (found but not relevant to ProductsPage POM):**
- Sidebar links: `inventory-sidebar-link`, `about-sidebar-link`, `logout-sidebar-link`, `reset-sidebar-link`
- Menu toggles: `open-menu`, `close-menu`
- Footer: `social-twitter`, `social-facebook`, `social-linkedin`, `footer-copy`
- Container divs: `header-container`, `primary-header`, `secondary-header`, `inventory-container`, `inventory-list`, `inventory-item-description`

//comment: when and where do we add these global elements? should we've captured it earlier?

---

### Proposed locators for `products-page.ts`

**Static locators (defined in constructor):**

| Property | Locator | data-test value |
|----------|---------|-----------------|
| `cartLink` | `page.getByTestId('shopping-cart-link')` | `shopping-cart-link` |
| `cartBadge` | `page.getByTestId('shopping-cart-badge')` | `shopping-cart-badge` |
| `sortDropdown` | `page.getByTestId('product-sort-container')` | `product-sort-container` |

**Dynamic locators (resolved via method parameter):**

| Method | Locator | Example call |
|--------|---------|--------------|
| `addToCartButton(dataTestId)` | `page.getByTestId(dataTestId)` | `addToCartButton('add-to-cart-sauce-labs-backpack')` |
| `removeButton(dataTestId)` | `page.getByTestId(dataTestId)` | `removeButton('remove-sauce-labs-backpack')` |

*Caller passes the full data-test value — no string conversion or abstraction.*

### Self-review — Locator checklist

**Scope:** Static page elements + per-product add/remove buttons only. Display elements (`inventory-item-name`, `desc`, `price`) and detail page links are out of scope — no current tests require them. See Deferred Decisions.

- [x] Locators use `data-test` attribute via `getByTestId()` where available
- [x] No `getByRole()` needed — all elements have `data-test`
- [x] No semantic fallbacks needed
- [x] No CSS class selectors used
---

## Section 3: Final Consolidated Locators

*Agreed locators after human review, AI review, and Q&A. These go into `pages/products-page.ts`.*

### Static locators (set up in constructor — always on the page)

| Property | Locator | Decision notes |
|----------|---------|----------------|
| `cartLink` | `page.getByTestId('shopping-cart-link')` | Header element, included here pragmatically — revisit when CartPage/CheckoutPage needed |
| `cartBadge` | `page.getByTestId('shopping-cart-badge')` | Dynamic state — only appears after adding item, but locator defined upfront |
| `sortDropdown` | `page.getByTestId('product-sort-container')` | Single `<select>` element — options selected by text value, no separate locators needed |

### Dynamic locators (resolved via method parameter)

| Method | Locator | Usage |
|--------|---------|-------|
| `addToCartButton(dataTestId: string)` | `page.getByTestId(dataTestId)` | `PRODUCTS.backpack.addToCart` |
| `removeButton(dataTestId: string)` | `page.getByTestId(dataTestId)` | `PRODUCTS.backpack.remove` |

### Out of scope (deferred — see Deferred Decisions)

| Element | Reason |
|---------|--------|
| `inventory-item-name`, `desc`, `price` | No current test requires product display verification |
| `item-{n}-title-link`, `item-{n}-img-link` | Navigate to detail page — belongs in a separate ProductDetailPage |
| Sidebar links, menu toggles | Global elements — deferred until duplication is felt across page objects |

---

## Deferred Decisions

| Decision | Trigger | Options |
|----------|---------|---------|
| Global elements (sidebar links, menu toggles) — where do they live? | When a test first needs them | (1) Add to each page object individually (2) Create shared Header/BasePage component |
| Per-product display elements (`inventory-item-name`, `desc`, `price`) | When a test needs to verify product display | Add to ProductsPage at that point |
| Product detail page links (`item-{n}-title-link`, `item-{n}-img-link`) | When a test navigates to product detail | Create separate ProductDetailPage |

---

*Last updated: 2026-03-11*
