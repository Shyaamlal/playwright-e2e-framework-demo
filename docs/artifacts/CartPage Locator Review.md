# CartPage Locator Review
**Date:** 2026-03-16
**Page:** `/cart.html`
**Purpose:** View cart items, remove items, proceed to checkout

---

## Section 1 — Human Inspection (Shyaamlal)

| data-test | Element | Notes |
|---|---|---|
| `title` | "Your Cart" text | Top of page |
| `cart-quantity-label` | "QTY" column header | ⚠ Written as `cart_quantity_label` (underscores) — actual uses hyphens |
| `cart-desc-label` | "Description" column header | ⚠ Written as `cart_desc_label` — actual uses hyphens |
| `item-quantity` | Quantity number per item | ⚠ Written as `item_quantity` — actual uses hyphens |
| `inventory-item-price` | Item price | ✓ |
| `inventory-item-desc` | Item description | ✓ |
| `continue-shopping` | Continue Shopping button | ✓ |
| `checkout` | Checkout button | ✓ |
| `remove-sauce-labs-backpack` | Remove button (Backpack) | ✓ follows `remove-{slug}` pattern |
| `inventory-item-name` | Item name | Called "link text" but it's a div |

**Questions raised:**
1. How do I know if something is a text element? → Need DevTools to see the tag. The element's role (text, button, link) comes from the HTML tag, not visual appearance.
2. VS Code autocompleted with Tab — likely picking up strings from existing `products.ts` or page objects in the codebase.
3. How do we handle multiple products? → Same pattern as ProductsPage: method takes `slug` as a parameter. `removeItem('sauce-labs-backpack')` → `page.getByTestId('remove-sauce-labs-backpack')`.

---

## Section 2 — AI Inspection (Claude via Playwright scrape)

Logged in as `standard_user`, added Bike Light to cart, navigated to `/cart.html`. Scraped all `data-test` attributes via `document.querySelectorAll('[data-test]')`.

**Full list found:**

| data-test | tag | Scope |
|---|---|---|
| `header-container` | div | Out of scope (global) |
| `primary-header` | div | Out of scope (global) |
| `open-menu` | img | Out of scope (global) |
| `inventory-sidebar-link` | a | Out of scope (global) |
| `about-sidebar-link` | a | Out of scope (global) |
| `logout-sidebar-link` | a | Out of scope (global) |
| `reset-sidebar-link` | a | Out of scope (global) |
| `close-menu` | img | Out of scope (global) |
| `shopping-cart-link` | a | Out of scope (already in ProductsPage) |
| `shopping-cart-badge` | span | Out of scope (already in ProductsPage) |
| `secondary-header` | div | Out of scope (structural) |
| `title` | span | In scope |
| `cart-contents-container` | div | Out of scope (structural wrapper) |
| `cart-list` | div | In scope — wraps all cart items, useful for empty cart assertion |
| `cart-quantity-label` | div | Out of scope (column header) |
| `cart-desc-label` | div | Out of scope (column header) |
| `inventory-item` | div | Out of scope (structural per-item wrapper) |
| `item-quantity` | div | In scope — quantity per item |
| `item-0-title-link` | a | Out of scope (detail page nav, no test needs it yet) |
| `inventory-item-name` | div | Out of scope (display only, no assertions needed yet) |
| `inventory-item-desc` | div | Out of scope (display only) |
| `inventory-item-price` | div | Out of scope (display only) |
| `remove-sauce-labs-bike-light` | button | In scope — follows `remove-{slug}` pattern |
| `continue-shopping` | button | In scope |
| `checkout` | button | In scope |
| `footer` | footer | Out of scope |
| `social-twitter/facebook/linkedin` | a | Out of scope |
| `footer-copy` | div | Out of scope |

**What AI found that human missed:**
- `cart-list` — container for all items (useful for empty cart assertion)
- `item-0-title-link` — actual link element on item name (distinct from `inventory-item-name` div)
- `inventory-item` — per-item wrapper div

**What human found that AI missed:**
- None this time (cart had only one item — Backpack's remove button follows same slug pattern)

---

## Section 3 — Agreed Locators (In Scope for CartPage)

| data-test | Type | Method/Property | Notes |
|---|---|---|---|
| `checkout` | button | `checkout` (Locator) | Primary action — proceed to checkout |
| `continue-shopping` | button | `continueShopping` (Locator) | Secondary action — go back to products |
| `remove-{slug}` | button | `removeItem(slug)` method | Dynamic — takes slug param, same slugs as PRODUCTS |
| `cart-list` | div | `cartList` (Locator) | For assertions — is cart empty / has items |
| `item-quantity` | div | `getItemQuantity()` or `itemQuantity` | Per-item quantity assertion |

**Deferred (add when test needs it):**
- `inventory-item-name` — if a test needs to assert item name is in cart
- `item-0-title-link` — if a test navigates to item detail page
- `item-quantity` — could be useful but no current test needs it

---

## Key Learnings from This Session

### Underscores vs hyphens — always verify
SauceDemo uses hyphens in all data-test values. Easy to write underscores by mistake. Always verify against the live scrape.

### `inventory-item-name` is a div, not a link
The clickable link on the item name is `item-0-title-link`. The `inventory-item-name` is a div containing the display text. Different elements, different purposes.

### Multiple items follow the same slug pattern
No new abstraction needed for multiple cart items. `remove-{slug}` works for any number of items. The slug is the same one used in PRODUCTS — no new constants needed.

### How to check display and text
- **Functional text:** `toHaveText()` asserts specific text content — Playwright does this
- **Visual appearance:** Requires `toHaveScreenshot()` (Playwright) or tools like Percy/Applitools — not yet implemented
- **Responsive layout:** Configure viewport per test (`{ width: 375, height: 812 }`), simulate devices (`devices['iPhone 13']`) — documented as future layer in project-context.md

### Browser close after AI inspection
After every Playwright MCP scrape, close the browser with `mcp__playwright__browser_close`. Do not leave it open — Shyaamlal had to close it manually.

---

## Deferred Decisions

| Decision | Trigger |
|---|---|
| Global elements (header, sidebar) | When duplication appears across 2+ page objects |
| Visual regression testing | After SauceDemo functional tests complete |
| Responsive viewport testing | After SauceDemo functional tests complete |
