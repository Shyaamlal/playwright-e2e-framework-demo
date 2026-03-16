# 05 - CartPage & Visual Testing Concepts

**Date:** 2026-03-16
**Session:** CartPage double-verification + visual/responsive testing discussion

---

## CartPage Double Verification

Followed the same process as ProductsPage (see `docs/artifacts/CartPage Locator Review.md`).

**Key finding:** Hyphens vs underscores. SauceDemo uses hyphens everywhere. Easy to write underscores by mistake — always verify against the live scrape.

**Human caught:** Correct elements on the page, correct pattern recognition (remove button, checkout, continue shopping).
**AI caught:** `cart-list` container, `item-0-title-link` vs `inventory-item-name` distinction, structural wrappers.

---

## How Do You Know if Something is a Text Element?

You can't tell from the screen alone. Open DevTools → hover over the element → Elements panel shows the HTML tag (`div`, `span`, `p`, `button`, `a`).

The tag determines the element's role:
- `<button>` → button (clickable, submits actions)
- `<a>` → link (navigates)
- `<div>`, `<span>`, `<p>` → generic containers (hold text, images, other elements)

Visual appearance (bold, underlined, coloured) is CSS — it can make a `div` *look* like a link without it being one. DevTools tells you what it actually is.

---

## How Do We Check Display and Text?

Three layers — only the first is implemented now:

**Layer 1 — Functional (what we build):**
`toHaveText('Your Cart')` — asserts text content exists. Fails if wrong text or missing element. Playwright does this natively.

**Layer 2 — Visual regression (future):**
`toHaveScreenshot()` — takes a baseline screenshot, compares pixel-by-pixel on future runs. Catches layout shifts, colour changes, missing elements that are still in the DOM. Tools: Playwright built-in, Percy, Applitools.

**Layer 3 — Responsive (future):**
Tests run at specific viewport sizes: `{ width: 375, height: 812 }` (mobile), `{ width: 1440, height: 900 }` (desktop). Playwright can simulate named devices: `devices['iPhone 13']`. Visual regression at each viewport catches layout breakages.

---

## Multiple Products in Cart — No New Abstraction Needed

The `remove-{slug}` pattern works for any number of cart items. The slugs are the same ones already in `PRODUCTS` test data. No new constants or classes.

```typescript
// Works for any product — slug comes from PRODUCTS
await cartPage.removeItem(PRODUCTS.backpack.remove)
// → clicks [data-test="remove-sauce-labs-backpack"]
```

The method takes a slug parameter. The abstraction is the parameter, not a new class.

---

## VS Code Autocomplete — How Did It Know?

VS Code's IntelliSense picks up string values from files already in the codebase — `products.ts`, existing page objects. It pattern-matches what you've written before. It's not "knowing" SauceDemo — it's reading your project.

---

## Process Update: Close Browser After AI Inspection

After every Playwright MCP scrape, always close the browser:
```
mcp__playwright__browser_close
```
Do not leave it open. Shyaamlal has to close it manually otherwise.

---

## Sources
- `docs/artifacts/CartPage Locator Review.md` — full double-verification artefact
- `project-context.md` — visual/responsive testing added to "After SauceDemo Complete"
