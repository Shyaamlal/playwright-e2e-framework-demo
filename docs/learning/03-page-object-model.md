# 03 - Page Object Model

**Date:** 2026-03-08
**Week 1, Day 4**

---

## What is Page Object Model (POM)?

A design pattern where each page (or significant component) of an application is represented by a class. That class holds:
- **Locators** — the elements on the page
- **Actions** — the methods (what a user can do on that page)

Tests then call the page object's methods rather than interacting with the DOM directly.

**Why it matters:**
- UI changes in one place → update locator in one place, not in every test
- Tests read like user workflows: `productsPage.addToCart('sauce-labs-backpack')`
- Separates *what you're testing* from *how you find the elements*

---

## What Belongs in a Page Object?

**Rule:** Only what is specific to that page, for the tests you are currently writing.

**In scope for ProductsPage:**
- Sort dropdown
- Product items (add to cart button, remove button, title link, image link, price)
- Cart icon and badge — shared header element, but directly relevant to cart behaviour being tested here

**Out of scope:**
- Burger menu, sidebar links, footer — shared across all pages
- These belong in a separate `NavigationComponent` or `BasePage` when you have multiple pages and feel the duplication pain

**Martin Fowler's principle:** *"Model the structure that makes sense to the user of the application."* Not every element, not every page — the significant ones.

---

## Shared Components: How Top Testers Handle Them

Two patterns when elements appear across multiple pages:

**1. BasePage (inheritance)**
```typescript
class BasePage {
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  constructor(page: Page) {
    this.cartIcon = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }
}

class ProductsPage extends BasePage {
  // ProductsPage-specific elements here
}
```

**2. Components folder (composition)**
```
pages/
  products-page.ts
components/
  navigation.ts   ← header, cart icon, burger menu
  footer.ts
```

**When to introduce these:** When you build the second or third page object and feel the duplication. Not before. Start lean.

---

## Double Verification — Human vs. AI Inspection

### What I found (manual inspection)
| data-test | Element |
|-----------|---------|
| `shopping-cart-link` | Cart icon |
| `shopping-cart-badge` | Cart item count badge |
| `product-sort-container` | Sort dropdown |
| `add-to-cart-sauce-labs-backpack` | Add to cart (Backpack) |
| `remove-sauce-labs-backpack` | Remove button (Backpack) |

### What Claude found that I missed
| data-test | Element | Note |
|-----------|---------|------|
| `open-menu` / `close-menu` | Burger menu toggle | Out of scope for POM |
| `inventory-sidebar-link` | All Items | Out of scope |
| `about-sidebar-link` | About | Out of scope |
| `logout-sidebar-link` | Logout | Out of scope |
| `reset-sidebar-link` | Reset App State | Out of scope |
| `title` | Page title "Products" | Display only |
| `active-option` | Currently selected sort label | Useful for sort assertions |
| `item-{n}-title-link` | Product title → detail page | In scope |
| `item-{n}-img-link` | Product image → detail page | In scope |
| `inventory-item-name/desc/price` | Product display fields | In scope for assertions |
| All 6 add-to-cart buttons | (I only noted Backpack) | Pattern: `add-to-cart-{slug}` |
| `social-twitter/facebook/linkedin` | Footer social links | Out of scope |

### What I found that Claude missed
| data-test | Element | Why Claude missed it |
|-----------|---------|----------------------|
| `shopping-cart-badge` | Cart count badge | Only appears after adding item — AI inspected empty cart |
| `remove-sauce-labs-backpack` | Remove button | Only appears after add to cart |

### Key learning from the comparison
**Claude inspects initial page state. I inspected behaviour.**

I added an item to cart first, which revealed the badge and remove button. That is a testing instinct — elements exist in different states, and you need to inspect across those states, not just on page load.

This is the V&V mindset from pharmaceutical validation applied to test automation: verify the system under conditions, not just at rest.

---

## The Bigger Picture: POM vs. AI-Native Testing (2026)

### What the ARIA snapshot actually looks like on SauceDemo

Ran `page.locator('body').ariaSnapshot()` on the ProductsPage after login. Real output:

```
- button "Open Menu"
- img "Open Menu"
- text: Swag Labs Products Name (A to Z)
- combobox:
  - option "Name (A to Z)" [selected]
  - option "Name (Z to A)"
  - option "Price (low to high)"
  - option "Price (high to low)"
- link "Sauce Labs Backpack"
- link "Sauce Labs Backpack"
- text: carry.allTheThings() with the sleek, streamlined Sly Pack... $29.99
- button "Add to cart"
- link "Sauce Labs Bike Light"
- link "Sauce Labs Bike Light"
- text: A red light isn't the desired state in testing... $9.99
- button "Add to cart"
- link "Sauce Labs Bolt T-Shirt"
...
- button "Add to cart"
```

Six products. Six buttons. All named **"Add to cart"**. No way to tell them apart.

### The concrete comparison

| Approach | How it sees "Add Backpack to cart" |
|----------|-----------------------------------|
| **POM / data-test** | `add-to-cart-sauce-labs-backpack` — unique, explicit |
| **ARIA snapshot** | `button "Add to cart"` — identical to all other products |

**The finding:** ARIA describes what a screen reader hears. For SauceDemo, that is ambiguous — the developer did not give each button a unique accessible name. An AI agent relying purely on the ARIA tree cannot reliably target a specific product's button.

**The underlying reason:** SauceDemo was built for visual testing demos, not accessibility. In a well-built application, each "Add to cart" button would have a unique ARIA label (e.g., "Add Sauce Labs Backpack to cart"), and the ARIA approach would work cleanly.

### Where the field is moving

Debbie O'Brien and the Playwright team are moving toward ARIA-based selectors and AI-native workflows over static POM files:
- Playwright MCP reads the accessibility tree in snapshot mode — no DOM, no data-test, no page objects
- Playwright v1.56+ ships three built-in agents — planner, generator, healer
- Human role is shifting to "calibrating the agent": reviewing traces to ensure AI logic matches business intent

**Playwright CLI** — also moving in this direction, reportedly 4x more token-efficient than MCP. Not yet explored hands-on. To do before documenting.

### The tension for this project

We are deliberately learning POM as a foundation. That is still valid:
- POM is the industry-standard pattern most hiring managers recognise
- Understanding *why* POM exists makes you a better judge of when AI-generated selectors are good or bad
- You cannot calibrate an agent well without knowing what correct looks like

The SauceDemo ARIA comparison is the clearest illustration of this: without knowing that `add-to-cart-sauce-labs-backpack` exists, you cannot spot that the AI agent's ARIA-based approach is ambiguous.

*Potential LinkedIn post:* "I'm learning POM foundations while the industry moves toward AI agents and ARIA selectors. Here's why I think both matter — and what each one teaches you that the other can't."

---

## Sources
- [Martin Fowler — PageObject](https://martinfowler.com/bliki/PageObject.html)
- [Playwright official docs — Page Object Models](https://playwright.dev/docs/pom)
- [Page Objects that Suck Less — John Ferguson Smart](https://johnfergusonsmart.com/page-objects-that-suck-less-tips-for-writing-more-maintainable-page-objects/)
- [Debbie O'Brien — Letting Playwright MCP Explore your site](https://dev.to/debs_obrien/letting-playwright-mcp-explore-your-site-and-write-your-tests-mf1)
- [State of Playwright AI Ecosystem in 2026 — Currents.dev](https://currents.dev/posts/state-of-playwright-ai-ecosystem-in-2026)
- [The Complete Playwright End-to-End Story — Microsoft for Developers](https://developer.microsoft.com/blog/the-complete-playwright-end-to-end-story-tools-ai-and-real-world-workflows)
