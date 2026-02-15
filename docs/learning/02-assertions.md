# 02 - Assertions

**Topics covered:** What assertions are, common assertion types, assertion sequencing, test scope, preconditions
**Sessions:** Day 3 (Feb 15, 2026)
**Tools used:** Claude, SauceDemo, Claude Code

---

## What is an Assertion?

An assertion is how Playwright verifies that something happened correctly after an action.

In manual testing you do this naturally - after clicking "Add to cart" you look at the page and check: did the cart count go up? That checking step is an assertion.

In Playwright:
```typescript
await expect(page.getByTestId("shopping-cart-badge"))
  .toHaveText("1")
```

Plain English: *"I expect the cart badge to show the number 1."*

---

## Anatomy of an Assertion

Every Playwright assertion has the same structure:
```typescript
await expect(locator).somethingToVerify()
```

- `await` - wait for this to be true
- `expect()` - here is what I am checking
- `locator` - find this element first
- `.toHaveText()` / `.toBeVisible()` - what I expect

Playwright automatically waits for the assertion to become true before failing. No need for manual waits or timeouts.

---

## Common Assertions

| Assertion | What it checks |
|---|---|
| `toBeVisible()` | Element is on screen |
| `toHaveText("abc")` | Element contains exact text |
| `toContainText("abc")` | Element contains this text somewhere |
| `toHaveValue("abc")` | Input field contains this value |
| `toBeEnabled()` | Button/input is clickable |
| `toBeDisabled()` | Button/input is greyed out |
| `toHaveCount(3)` | Exactly 3 matching elements exist |
| `toBeGreaterThanOrEqual(2)` | Numeric comparison |

---

## Assertion Sequencing

Assertions run top to bottom, one line at a time:
```typescript
// Action first
await page.getByTestId("add-to-cart-sauce-labs-backpack")
  .click()

// Then assertions in sequence
await expect(page.getByTestId("remove-sauce-labs-backpack"))
  .toBeVisible()
await expect(page.getByTestId("remove-sauce-labs-backpack"))
  .toHaveText(/remove/i)
await expect(page.getByTestId("shopping-cart-badge"))
  .toHaveText("1")
```

If any assertion fails, the test stops at that line and reports exactly what went wrong.

---

## Thinking Beyond the Obvious

When "Add to cart" is clicked, two things are visually obvious:
1. Cart badge shows "1"
2. Button changes to "Remove"

But a senior tester asks: *what else should I verify?*

- Are other products unaffected? (isolation check)
- Is the right item in the cart? (correctness check)  
- Is the price correct? (data integrity check)

The third one is critical - a bug could add the item to the cart but show the wrong price. The two obvious assertions would not catch that.

**This is your 10 years showing up** - not just checking "did something happen" but "did the right thing happen correctly."

---

## Test Scope

Each test should verify one thing clearly.

**Too broad (bad):**
One test covers: login + add to cart + verify cart contents + verify price + checkout

When it fails - what broke? You don't know.

**Well scoped (good):**

**Test 1 - Add to cart**
- Click Add to cart
- Verify cart badge shows 1
- Verify button changes to Remove
- Verify other products unaffected

**Test 2 - Cart contents**
- Precondition: item already in cart
- Navigate to cart
- Verify correct item name
- Verify correct price

**Test 3 - Checkout flow**
- Precondition: item in cart
- Complete checkout
- Verify order confirmation

When Test 2 fails, you know immediately: cart display is broken, not the add to cart action.

---

## Preconditions

Every test needs to start from a known state. This is called a **precondition**.

For the Add to Cart test, the precondition is: 
*logged in, on the products page.*

**Two approaches:**

**beforeEach hook** - login runs before every test:
```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com')
  await page.getByPlaceholder('Username').fill('standard_user')
  await page.getByPlaceholder('Password').fill('secret_sauce')
  await page.getByTestId('login-button').click()
})
```

**Project dependencies** - login once, reuse session. Faster for large test suites. Demonstrated by Debbie 
O'Brien in her NDC talk. Protects credentials from LLM context. To be implemented when we cover fixtures.

Currently using `beforeEach` - simple and correct for learning.

---

## AI Verification - What To Check

When Claude Code generates assertions, verify:

1. **Does it assert enough?** Happy path only, or edge cases too?
2. **Is it asserting the right thing?** Visible ≠ correct
3. **Is scope respected?** One test, one responsibility
4. **Are preconditions handled?** Login in beforeEach, not inside the test
5. **Are locators stable?** Apply locator rules from Topic 01

---

## What Claude Code Got Right and Wrong

**First attempt - wrong:**
Used `getByRole('button', { name: /add to cart/i })` which found multiple buttons. Ambiguous locator - all 6 tests failed.

**Self-corrected - better:**
Switched to specific `data-test` locators. Tests passed.

**Still missed:**
Used `.shopping_cart_badge` CSS class for cart badge locator. This was wrong when `data-test="shopping-cart-badge"` was available.
Caught during human review. Fixed with precise prompt.

**Scope violation:**
Added a second test without being asked. Tests passed but scope was exceeded. Caught during human review.

**Lesson:** Passing tests are not the same as good tests. Human verification catches what automated runs cannot.

---

## Real Prompt That Worked

This prompt produced the right test after learning from the first attempt:

> *"I need two fixes to tests/add-to-cart.spec.ts:*
> *Fix 1: Replace CSS class locator with getByTestId*
> *Fix 2: Remove second test entirely, do not replace it*
> *Run the remaining test and confirm it still passes."*

Precision in prompting = less room for AI to make unauthorised decisions.

---

## Key Insight

> *"Passing tests are not the same as correct tests."*

A test can pass while:
- Using unstable locators
- Exceeding agreed scope  
- Missing critical assertions
- Hiding real bugs

Your job is not to get tests to green. Your job is to 
ensure green means something.