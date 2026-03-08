# AI-Generated Code Review Process

How to review page object and test code produced by Claude before accepting it into the project.

**Sources:** Applitools, BrowserStack, Codoid — testing expert practices, not a single opinion.

---

## Why Review Matters

AI generates code fast. The challenge is not generation — it's making that code stable, maintainable, and trustworthy in CI. A review process is the human quality gate between generation and commit.

Your GxP background applies here: generated code is like a draft validation document. It needs verification before it becomes evidence.

---

## Two-Stage Process

**Stage 1 — Claude self-reviews** before presenting code (instructions in `CLAUDE.md`)
**Stage 2 — You review** before committing

Both stages use the same criteria. Claude catching its own mistakes saves your review time.

---

## Human Review Checklist

### 1. Locators
**What to check:** Are locators stable and correctly placed?

- [ ] `data-test` attributes used via `getByTestId()` wherever they exist
- [ ] No CSS class selectors (e.g., `.shopping_cart_badge`) — these break when styling changes
- [ ] Locators defined in the page object, not written directly inside the test

**Why:** Locators in one place means one update when the UI changes, not ten.

---

### 2. Assertions
**What to check:** Do assertions actually prove the feature works?

- [ ] Assertions verify a state change, not just that something is visible
- [ ] Each assertion would fail if the feature it tests actually broke
- [ ] No assertions inside page object methods (page objects interact, tests assert)

**Example of weak assertion:**
```typescript
await expect(cartBadge).toBeVisible(); // passes even if count is wrong
```

**Example of meaningful assertion:**
```typescript
await expect(cartBadge).toHaveText('1'); // fails if count is wrong
```

**Why:** A test that always passes regardless of bugs is worse than no test.

---

### 3. Scope
**What to check:** Did Claude stay within what was requested?

- [ ] No extra tests added beyond what was asked for
- [ ] Each test has one clear responsibility
- [ ] Tests are independent — no test relies on another test's state or output

**Why:** Scope creep in tests creates noise. A focused test tells you exactly what broke.

---

### 4. Wait Strategy
**What to check:** Are there any artificial delays?

- [ ] No `waitForTimeout()` or hardcoded millisecond waits
- [ ] No `{ force: true }` on clicks (masks real timing issues)
- [ ] Playwright's built-in auto-waiting is trusted

**Why:** Hardcoded waits make tests slow and brittle. Playwright waits for the real UI state automatically.

---

### 5. Structure
**What to check:** Is setup in the right place?

- [ ] Login happens in `beforeEach`, not inside the test body
- [ ] Test data comes from `test-data/` files, not hardcoded strings

**Why:** Setup inside tests makes them harder to read and maintain. Separated test data means one place to update credentials or products.

---

## What "State" Means

State = the current condition of any part of the system at a given moment.

| Type | Examples on SauceDemo |
|------|----------------------|
| **UI state** | Button shows "Add to cart" vs "Remove" |
| **UI state** | Cart badge visible with "1" vs not present |
| **Application state** | User is logged in vs logged out |
| **Application state** | Cart contains 1 item vs is empty |
| **Data state** | User account is locked vs active |

Good assertions verify state transitions: *after I do X, the system should be in state Y.*

---

## Sources
- [Guide to Conducting Test Automation Code Reviews — Applitools](https://applitools.com/blog/guide-to-test-automation-code-reviews/)
- [Test Automation Standards and Checklist — BrowserStack](https://www.browserstack.com/guide/test-automation-standards-and-checklist)
- [Code Review Best Practices for Automation Testing — Codoid](https://codoid.com/automation-testing/code-review-best-practices-for-automation-testing/)
