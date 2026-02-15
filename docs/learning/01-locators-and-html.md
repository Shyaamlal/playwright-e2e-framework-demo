# 01 - Locators and HTML Fundamentals

**Topics covered:** HTML attributes, locator types, 
locator strategy, accessibility tree
**Sessions:** Day 2-3 (Feb 14-15, 2026)
**Tools used:** Claude, Chrome DevTools, SauceDemo

---

## What is a Locator?

A locator is how Playwright finds an element on a page before interacting with it. Just as a human reads a label or sees a button visually, Playwright needs a programmatic way to find the same element.

Choosing the right locator is one of the most important decisions in automation. A bad locator breaks every time the UI changes. A good locator is stable and mirrors how a real user sees the page.

---

## Anatomy of an HTML Element

When you right-click any element and click Inspect, you see its HTML. Two real examples from SauceDemo:

**Input field (login page):**
```html
<input class="input_error form_input" 
       placeholder="Username" 
       type="text" 
       data-test="username" 
       id="user-name" 
       name="user-name" 
       autocorrect="off" 
       autocapitalize="none" 
       value="">
```

**Button (products page):**
```html
<button class="btn btn_primary btn_small btn_inventory" 
        data-test="add-to-cart-sauce-labs-backpack" 
        id="add-to-cart-sauce-labs-backpack" 
        name="add-to-cart-sauce-labs-backpack">
  Add to cart
</button>
```

The second example answers an early question: locators work the same way for buttons as they do for inputs. The element type changes, the strategy doesn't.

---

## Key HTML Attributes

**`placeholder`**
Grey hint text visible before typing. Disappears on input.
Playwright: `getByPlaceholder("Username")`

**`type`**
Defines input behaviour. Common types:
- `text` - plain text
- `password` - hides characters  
- `email` - validates email format
- `number` - numbers only
- `checkbox` - tick box
- `radio` - radio button
- `file` - file upload

**`data-test`** (also `data-testid`, `data-cy`, `data-qa`)
Added deliberately by developers for testing. No visual effect. Most stable locator because it doesn't change when UI is restyled.

⚠️ The attribute name varies by team. First question when joining a company: *"Do we have a test attribute convention?"*

In this project: configured as `testIdAttribute: 'data-test'`in `playwright.config.ts` so `getByTestId()` works correctly.

**`id`**
Unique browser identifier. No two elements share the same id. Used by Playwright as `locator("#user-name")`.

**`name`**
Used by the server when form data is submitted.
Journey: Browser → Server (reads `name`) → Database

**`autocorrect="off"` and `autocapitalize="none"`**
Deliberately turned off for username fields - mobile keyboards auto-capitalise first letters which breaks login.
Testing implication: verify login works on mobile viewports.

**`value=""`**
Empty = no default text pre-filled in the field.

**`class`**
CSS styling identifier. Can change when UI is restyled.
❌ Never use class as a locator.

---

## Locator Priority Order

| Priority | Locator | Example | Why |
|---|---|---|---|
| ⭐⭐⭐ Best | `getByTestId()` | `getByTestId("username")` | Built for testing, stable |
| ⭐⭐ Good | `getByRole()` | `getByRole("button", { name: "Login" })` | Accessibility tree, MCP compatible |
| ⭐⭐ OK | `getByPlaceholder()` | `getByPlaceholder("Username")` | Visible text, can change |
| ⭐ Risky | `locator("#id")` | `locator("#user-name")` | Not built for testing |
| ❌ Never | CSS class | `locator('.shopping_cart_badge')` | Changes with UI restyling |

---

## The Ambiguous Locator Problem

SauceDemo has multiple "Add to cart" buttons - one per product. Using `getByText("Add to cart")` would either:
- Click the first one found (wrong product)
- Throw an error: "multiple elements found"

This is called an **ambiguous locator**. Always verify that your locator targets exactly one element.

The fix: use the specific `data-test` value:
`getByTestId("add-to-cart-sauce-labs-backpack")`

---

## Semantic HTML and the Accessibility Tree

Not all HTML is created equal.

**Semantic (good):**
```html
<button type="submit">Add to cart</button>
```
Screen readers announce: *"Add to cart, button"*
Playwright MCP can find it reliably.

**Non-semantic (bad):**
```html
<div class="btn" onclick="addToCart()">Add to cart</div>
```
Screen reader announces: *"div"* or nothing.
Playwright MCP struggles to find it.

Key insight from Debbie O'Brien's NDC talk: Playwright MCP reads the accessibility tree - the same way screen readers do. Good accessibility = reliable automation. They are the same problem.

---

## What is Accessibility?

Accessibility means everyone can use the application regardless of how they interact with it - including people who use screen readers, keyboard-only navigation, or high contrast modes.

**WCAG** (Web Content Accessibility Guidelines) is the 
international standard:
- **A** - minimum compliance
- **AA** - industry standard target
- **AAA** - gold standard

Tools for testing accessibility:
- axe DevTools (Chrome extension)
- Playwright's built-in accessibility checks
- Lighthouse (built into Chrome DevTools)

---

## Key Questions Answered

**Q: What happens when there is no data-test attribute?**
Use `getByRole()` as the next preference. It finds elements the same way the accessibility tree does - by their role and accessible name. This is also how Playwright MCP navigates pages.

**Q: How do I find locators for elements that aren't inputs?**
Same strategy applies. Inspect the element, look for `data-test` first, fall back to `getByRole()`. The button example above shows this in practice.

**Q: Is the data-test attribute still relevant when AI writes the code?**
Yes - but the responsibility shifts. Instead of telling developers to add `data-test` attributes, you tell AI to write semantic, accessible HTML. Same outcome, just adifferent executor. `getByRole()` works without `data-test` when HTML is semantic.

---

## Real-World Verification Skill

When Claude Code generates a test, check every locator:

1. Does it use `data-test`? ✅ Good
2. Does it use `getByRole()`? ✅ Acceptable
3. Does it use a CSS class? ❌ Flag and fix
4. Is the locator specific enough? (no ambiguous matches) ✅ Check
5. Could this locator break if the UI is restyled? ✅ Consider

This is verification and validation of AI output - your core skill as an AI-native automation tester.

---

## Key Insight From Debbie O'Brien's NDC Talk

> *"You are the foundation. You have to lay that down. 
> That is still your job."*

When AI generates tests, it will choose locators. Your job is to verify those choices are stable and correct. 
Understanding locator quality is how you validate AI output - regardless of which tool or framework you're working with.