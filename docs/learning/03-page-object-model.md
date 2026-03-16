# 03 - Page Object Model

**Date:** 2026-03-08
**Week 1, Day 4

For concepts, structure, and reference: `docs/concepts/page-objects.md`

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

### Key learning
**Claude inspects initial page state. I inspected behaviour.**

I added an item to cart first, which revealed the badge and remove button. That is a testing instinct — elements exist in different states, and you need to inspect across those states, not just on page load.

This is the V&V mindset from pharmaceutical validation applied to test automation: verify the system under conditions, not just at rest.

---

## ARIA vs. data-test — What I Actually Saw

Ran `page.locator('body').ariaSnapshot()` on the ProductsPage after login. Real output:

```
- button "Open Menu"
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
...
- button "Add to cart"
```

Six products. Six buttons. All named **"Add to cart"**. No way to tell them apart.

| Approach | How it sees "Add Backpack to cart" |
|----------|-----------------------------------|
| **POM / data-test** | `add-to-cart-sauce-labs-backpack` — unique, explicit |
| **ARIA snapshot** | `button "Add to cart"` — identical to all other products |

**Why:** SauceDemo was built for visual testing demos, not accessibility. Each button should have a unique ARIA label (e.g., "Add Sauce Labs Backpack to cart") — it doesn't. In a well-built app, ARIA would work cleanly here.

**The implication:** Understanding POM and data-test attributes is what lets you spot when an AI agent's ARIA-based approach is ambiguous. You cannot catch this without knowing what correct looks like.

**Where the field is moving:** Debbie O'Brien and the Playwright team are moving toward ARIA-based selectors and AI-native workflows. Playwright MCP reads the accessibility tree. Playwright CLI is 4x more token-efficient than MCP. Not yet explored hands-on — to document after exploring.

*LinkedIn post idea:* "I'm learning POM foundations while the industry moves toward AI agents and ARIA selectors. Here's why I think both matter."

---

## Why XPath Disappeared

Ten years ago, XPath was considered the key skill in Selenium WebDriver. Now it's a last resort. That shift is worth understanding.

**The Selenium era:** Apps were built without testers in mind. No test attributes, often poor semantic HTML. XPath let you navigate the raw DOM structure to find anything — `//div[@class='header']/ul/li[2]/a`. Precise but brittle. The skill was knowing how to write those paths.

**What changed:**
- **Semantic HTML became standard** — developers started using proper roles, labels, and headings
- **Accessibility became a legal requirement** in many markets (WCAG compliance) — this pushed devs to write HTML that screen readers can navigate cleanly, which `getByRole()` benefits from directly
- **Test attributes became a best practice** — the industry learned that `data-test` IDs are cheap to add and make tests dramatically more stable
- **Playwright was designed for this world** — built assuming modern apps, so role-based and test-id locators are first-class citizens. XPath is supported but rarely needed.

**What it signals today:** If you need XPath, it usually means one of two things — a legacy app, or a modern app built without testing or accessibility in mind. Both are worth flagging.

---

## Sources
- [Debbie O'Brien — Letting Playwright MCP Explore your site](https://dev.to/debs_obrien/letting-playwright-mcp-explore-your-site-and-write-your-tests-mf1)
- [State of Playwright AI Ecosystem in 2026 — Currents.dev](https://currents.dev/posts/state-of-playwright-ai-ecosystem-in-2026)
- [The Complete Playwright End-to-End Story — Microsoft for Developers](https://developer.microsoft.com/blog/the-complete-playwright-end-to-end-story-tools-ai-and-real-world-workflows)
