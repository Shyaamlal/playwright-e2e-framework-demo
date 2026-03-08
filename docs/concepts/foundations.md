# Testing Foundations

Core concepts for test automation. Reference this when a question comes up — better to check here than relearn from scratch.

---

## 1. Testing Pyramid

Different levels of testing serve different purposes. Each level has different scope, speed, and cost.

```
        /\
       /E2E\          Slow, expensive, closest to real user
      /------\
     /  SIT   \       Medium speed, tests integrations
    /----------\
   / Component  \     Fast, tests UI in isolation
  /--------------\
 /   Unit Tests   \   Fastest, tests single functions
/------------------\
```

**The principle:** Lower levels are faster and cheaper. Higher levels give more confidence but cost more. A healthy production suite has more unit tests than E2E tests. For a portfolio project testing an external app, E2E is the right starting point.

---

## 2. Test Types

**Unit Testing**
Tests a single function or class in isolation. All dependencies are mocked. Fast, no browser, no network. Used by developers during development.

**Component Testing**
Tests a single UI component (e.g., a React button or form) in isolation. Rendered in a test environment. Requires access to source code.

**Integration Testing / SIT (System Integration Testing)**
Tests how different parts of the system talk to each other — API calls, database interactions, service-to-service communication. No browser needed.

**E2E Testing (End-to-End)**
Tests the full user journey through a real browser, hitting real pages, using real data flows. Slowest, but closest to what a real user experiences.

**UAT (User Acceptance Testing)**
Validates the system meets business requirements from the user's perspective. Typically done by humans before go-live. E2E tests automate what UAT would verify manually.

| Level | Tool (this project) | Status |
|-------|---------------------|--------|
| Unit | Jest, Vitest | Not planned |
| Component | React Testing Library | Not planned |
| Integration / SIT | Playwright API testing | Week 2 |
| E2E | Playwright | Now |

---

## 3. State

State = the current condition of any part of the system at a given moment.

**UI state** — what the user sees and can interact with
```
Cart badge: not visible        →  after addToCart()  →  visible, shows "1"
Button: "Add to cart"          →  after addToCart()  →  "Remove"
Dropdown: "Name (A to Z)"      →  after sortBy()     →  "Price (low to high)"
```

**Application state** — what the system knows and remembers
```
User: not logged in            →  after login()      →  logged in, session active
Cart: empty                    →  after addToCart()  →  contains 1 item
```

**Data state** — what exists in the database
```
User account: active           →                     →  locked (different user type)
```

Good assertions verify **state transitions**: after I do X, the system should be in state Y.

```typescript
// Weak — only checks existence
await expect(cartBadge).toBeVisible();

// Strong — checks the actual state
await expect(cartBadge).toHaveText('1');
```

---

## 4. State Transfer Across Pages

In a multi-page user journey, state is **not passed between page objects or tests**. The browser and server handle it automatically.

**What holds state:**
- **Browser session / cookies** — login state. Once `login()` succeeds, every subsequent request carries the session cookie automatically.
- **Server / database** — cart contents, order details. When you add a product, the server records it. The cart page retrieves it from the server, not from your code.
- **URL** — the server decides whether you're allowed to reach a given page based on session state.

```typescript
await loginPage.login(username, password);           // server sets session cookie
await productsPage.addToCart('sauce-labs-backpack'); // server records item in cart
await productsPage.openCart();                       // browser navigates to /cart.html
// CartPage loads — server returns cart with backpack in it
// No data was passed from productsPage to cartPage in your code
```

---

## 5. Test Independence

Each test must start from a known, clean state and not rely on any other test.

**Why it matters:** If Test A adds items to cart and Test B assumes the cart is empty, they will interfere — because the browser session (and server state) is shared between tests in the same run.

**How to achieve it:**
- Login in `beforeEach` — fresh session for each test
- Don't share data between tests
- Clean up after tests that mutate state

A test that passes alone but fails when run after another test has a **state leak**. Find the root cause and fix it — don't work around it.

---

## 6. Page Object Model (POM)

A design pattern where each page (or significant component) of an application is represented by a class. That class holds elements and methods. Tests call page object methods rather than interacting with the DOM directly.

**Why it matters:**
- UI changes in one place → update locator in one place, not in every test
- Tests read like user workflows: `productsPage.addToCart('sauce-labs-backpack')`
- Separates *what you're testing* from *how you find the elements*

---

## 7. Page Object Structure — Elements AND Methods

```typescript
export class ProductsPage {
  readonly page: Page;

  // Elements — locators
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  // Methods — actions a user can take
  async addToCart(productSlug: string) {
    await this.page.getByTestId(`add-to-cart-${productSlug}`).click();
  }

  async getCartCount(): Promise<number> {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    return parseInt(await this.cartBadge.textContent() || '0', 10);
  }
}
```

**The line between page object and test:**
- Page object → elements + actions (knows *how*)
- Test → assertions (verifies *what* happened)

Assertions never go inside page object methods.

---

## 8. What Belongs in a Page Object

**Rule:** Only what is specific to that page, for the tests you are currently writing.

**In scope (ProductsPage example):**
- Sort dropdown
- Product items (add to cart, remove, title link, image link, price)
- Cart icon and badge — shared header element, but directly relevant to cart behaviour being tested

**Out of scope:**
- Burger menu, sidebar links, footer — shared across all pages
- These belong in a `NavigationComponent` or `BasePage` when you have multiple pages and feel the duplication pain

**Martin Fowler:** *"Model the structure that makes sense to the user of the application."*

---

## 9. Shared Components — When Elements Appear Across Pages

**BasePage (inheritance)** — common elements in a base class all pages inherit from:
```typescript
class BasePage {
  readonly cartIcon: Locator;
  constructor(page: Page) {
    this.cartIcon = page.getByTestId('shopping-cart-link');
  }
}
class ProductsPage extends BasePage { ... }
```

**Components folder (composition)** — shared elements as separate objects:
```
pages/
  products-page.ts
components/
  navigation.ts
```

**When to introduce:** When you build the second or third page object and feel the duplication pain. Not before.

---

## 10. User Journeys Across Multiple Pages

Each page object handles its own page. The **test is the conductor**.

```typescript
test('should complete checkout', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const checkoutPage = new CheckoutInfoPage(page);

  await loginPage.login(TEST_USERS.standard.username, TEST_USERS.standard.password);
  await productsPage.addToCart('sauce-labs-backpack');
  await productsPage.openCart();
  await checkoutPage.fillForm('John', 'Doe', '12345');

  await expect(page).toHaveURL(/checkout-complete/);
});
```

- No page object knows about another page object
- If the journey changes, update the test — not the page objects
- State transfers via browser/server (see section 4 above)

---

## Sources
- [Martin Fowler — PageObject](https://martinfowler.com/bliki/PageObject.html)
- [Playwright official docs — Page Object Models](https://playwright.dev/docs/pom)
- [Page Objects that Suck Less — John Ferguson Smart](https://johnfergusonsmart.com/page-objects-that-suck-less-tips-for-writing-more-maintainable-page-objects/)
