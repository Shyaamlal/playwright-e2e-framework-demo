# Playwright E2E Test Automation - Learning Project Context

**Last updated:** 2026-03-08  
**Status:** In progress - ProductsPage implementation  
**Timeline:** Following 3-week learning plan

---

## 1. Project Context

### What We're Building
A Playwright TypeScript test automation framework demonstrating an **AI-native testing approach** for web applications. The framework tests SauceDemo (saucedemo.com) to showcase:
- End-to-end user journey automation
- Page Object Model architecture
- Test data abstraction
- CI/CD integration
- AI-assisted test development with human verification

### Why This Project Exists
**Background:** Transitioning from 10 years of manual testing (pharmaceutical) to automation testing after job loss. Building a portfolio that demonstrates:
- Ability to design test strategy and define acceptance criteria
- AI-native workflow: human as test strategist, AI (Claude Code) as implementer
- Strong verification and validation (V&V) skills applied to AI-generated code
- Modern automation practices ready for immediate employment

**Target audience:** Hiring managers and technical reviewers evaluating portfolio for QA automation roles requiring Playwright, TypeScript, and AI-assisted testing capabilities.

**Philosophy:** Based on Debbie O'Brien's NDC talk principle: *"You are the foundation. That is still your job."* AI generates code; human defines strategy, verifies quality, and makes architectural decisions.

---

## 2. Learning Structure

### 3-Week Learning Plan

**Week 1: Playwright + TypeScript Foundations**
- Day 1: Environment setup, GitHub, CI/CD
- Day 2-3: Locators, HTML fundamentals, assertions
- Day 4-5: Page Object Model, first complete tests
- Day 6-7: Test data abstraction, framework structure

**Week 2: Advanced Patterns + Python/Pytest**
- Page objects for complex flows
- Python basics for API testing
- Pytest framework
- SQL basics for data validation

**Week 3: Integration + Polish**
- Combine Playwright E2E + Python API tests
- Portfolio documentation
- Interview preparation
- Final refinements

---

## 3. Progress Completed

### Day 1 (Feb 14, 2026) - Environment & Setup ✅
**Accomplished:**
- Installed VS Code, Node.js v24.13.1, Claude Code
- Created GitHub repository: `playwright-e2e-framework-demo`
- Initialized Playwright with TypeScript + GitHub Actions
- Ran sample tests (6 tests across 3 browsers)
- CI/CD pipeline working automatically
- Pomodoro timer extension for focus management

**Deliverables:**
- Working local environment
- GitHub repo with CI/CD
- Playwright config with TypeScript

---

### Days 2-3 (Feb 14-15, 2026) - Locators & Fundamentals ✅
**Topics covered:**
- HTML element anatomy (attributes: placeholder, type, data-test, id, name, value)
- Locator strategy hierarchy
- Semantic HTML and accessibility tree
- What is accessibility (WCAG AA standard)
- Assertions and their purpose
- Test scope and preconditions

**Page objects created:**
- `LoginPage` with `login(username, password)` method
- Test data file: `tests/test-data/users.ts` with `TEST_USERS` object

**Tests created:**
- `tests/login.spec.ts` - valid login, locked out user error
- `tests/add-to-cart.spec.ts` - add product, verify cart badge, button state

**Key learning documents:**
- `docs/learning/01-locators-and-html.md`
- `docs/learning/02-assertions.md`
- `docs/concepts/testing-framework.md` (comprehensive process guide)

**Configuration:**
- `playwright.config.ts` configured with `testIdAttribute: 'data-test'`
- Screenshots on failure enabled
- Trace on first retry

---

### Project Documentation ✅
**Files created:**
- `CLAUDE.md` - AI collaboration guide with testing philosophy, locator strategy, test design principles, future MCP integration notes
- `README.md` - Professional portfolio introduction explaining AI-native approach
- `docs/learning/index.md` - Navigation for learning notes
- `docs/concepts/testing-framework.md` - Portable 9-phase testing process (tool-agnostic)

**Repository structure:**
```
playwright-e2e-framework-demo/
├── tests/
│   ├── add-to-cart.spec.ts
│   ├── login.spec.ts
│   └── test-data/
│       └── users.ts
├── pages/
│   └── login-page.ts
├── docs/
│   ├── learning/
│   │   ├── index.md
│   │   ├── 01-locators-and-html.md
│   │   └── 02-assertions.md
│   └── concepts/
│       ├── testing-framework.md
│       └── glossary.md
├── .github/
│   └── workflows/
│       └── playwright.yml
├── CLAUDE.md
├── README.md
└── playwright.config.ts
```

---

### Day 4 (2026-03-08) - Page Object Model ✅

**Topics covered:**
- What belongs in a page object — scope discipline, shared components
- Shared element patterns: BasePage (inheritance) vs Components folder (composition)
- When to introduce these patterns: when you feel duplication pain, not before
- POM vs ARIA-native testing — what the field is moving toward and why POM still matters
- Accessibility tree: what it is, how it differs from DOM, how AI agents use it

**Double Verification — ProductsPage:**
- Manual inspection (human): 5 elements found, including dynamic state elements (cart badge, remove button) by inspecting after adding item to cart
- AI inspection (Claude): ran `data-test` scrape on live page — found all 6 product slugs, structural/display elements, but missed dynamic state elements
- Key learning: Claude inspects initial page state. Human inspected behaviour across states. Both needed.
- ARIA snapshot run on live page: all 6 "Add to cart" buttons indistinguishable — no unique accessible names on SauceDemo. Concrete evidence of when ARIA falls short vs data-test.

**Learning documents created:**
- `docs/learning/03-page-object-model.md` — POM concepts, scope, shared components, double verification comparison with real data, POM vs ARIA with actual snapshot output

---

### Refactoring & Consistency ✅
**Improvements made:**
- Unified login approach across all tests using `LoginPage` and `TEST_USERS`
- Removed hardcoded credentials from `add-to-cart.spec.ts`
- Fixed locator violations (replaced CSS class selectors with `getByTestId`)
- Removed scope violations (extra tests generated beyond request)

**Current test count:** 9 tests (3 tests × 3 browsers: Chromium, Firefox, WebKit)

---

## 4. Current Position

### What's Built and Working
✅ **Infrastructure:**
- Playwright TypeScript framework
- GitHub Actions CI/CD pipeline
- Professional documentation (README, CLAUDE.md)
- Learning journal with topic-based notes

✅ **Tests:**
- Login (happy path, error states)
- Add to cart (cart badge, button state changes)
- All tests use Page Object Model
- Test data abstracted in `TEST_USERS`

✅ **Page Objects:**
- `LoginPage` - complete with `login()` method, error handling
- Locators use `data-test` attributes consistently
- Single responsibility pattern

✅ **Conventions Established:**
- Locator priority: `data-test` → `getByRole()` → fallbacks
- One test = one responsibility
- Preconditions in `beforeEach` hooks
- Test data separated from test logic

### What's In Progress
⚠️ **ProductsPage:**
- Double verification complete (Steps 1-3 done): manual inspection, AI inspection, comparison documented
- Review process to be established before implementation
- Implementation next: `pages/products-page.ts`
- Planned to use exact data-test values (no string conversion)

### What's Not Started
❌ Checkout flow (CheckoutInfoPage, CheckoutOverviewPage)
❌ Complete user journey test
❌ API testing
❌ eslint-plugin-playwright integration
❌ AI review process — how to verify AI-generated code before accepting it (to be designed based on testing expert practices)
❌ Playwright CLI exploration — ARIA snapshot-first workflow, how it compares to MCP and POM in practice

---

## 5. Next Steps

### Current Task (Week 1, Day 4-5)
**ProductsPage Implementation - Path C (Double Verification)**

**Step 1:** ✅ Manual inspection of ProductsPage elements
**Step 2:** ✅ Claude Code inspection — full data-test scrape on live page
**Step 3:** ✅ Compare findings — documented in `docs/learning/03-page-object-model.md`

**Step 4:** Establish review process
- How to verify AI-generated code before accepting it
- Based on testing expert practices, not a single source
- Document as a reusable checklist in CLAUDE.md

**Step 5:** Implement ProductsPage
- Create `pages/products-page.ts`
- Methods: `addProductToCart(dataTestId)`, `removeProductFromCart(dataTestId)`, `goToCart()`, `getCartCount()`, `sortProducts(sortOption)`
- Use exact `data-test` values (no string conversion/abstraction)
- Follow CLAUDE.md conventions

**Step 6:** Write ProductsPage tests
- Add product to cart
- Sort products
- Verify cart count updates

---

### Upcoming (Week 1, Days 5-7)
**Checkout Flow:**
- `CheckoutInfoPage` - form with first name, last name, zip
- `CheckoutOverviewPage` - price summary, finish button
- One complete test: login → add product → checkout → confirmation
- Use `test.step()` for multi-step flow (not `test.describe.serial`)

**Documentation:**
- `docs/learning/03-page-object-model.md`
- Update README with current capabilities

---

### Week 2 Focus
**API Testing + Advanced Patterns:**
- Basic API testing with Playwright
- Python basics for API testing
- Pytest framework introduction
- SQL basics for data validation

**Quality Improvements:**
- Add `eslint-plugin-playwright`
- Fix any linting issues
- Ensure all tests pass consistently

---

## 6. Key Decisions & Conventions

### AI-Native Workflow
**Human responsibilities:**
- Define test strategy and scope
- Write acceptance criteria
- Choose locator strategies
- Design page object architecture
- Verify AI-generated code quality
- Make trade-off decisions

**AI (Claude Code) responsibilities:**
- Generate test implementation
- Create page object code
- Debug and fix issues
- Maintain consistent patterns

**Verification checklist for AI output:**
- Locators use `data-test` when available (never CSS classes)
- Scope not exceeded (no extra tests)
- Assertions are meaningful (not just visibility checks)
- Code follows CLAUDE.md conventions
- No hardcoded waits or `{ force: true }`

---

### Locator Strategy (Priority Order)

| Priority | Locator | When to Use | Example |
|---|---|---|---|
| ⭐⭐⭐ | `getByTestId()` | `data-test` attribute exists | `getByTestId('username')` |
| ⭐⭐ | `getByRole()` | Semantic HTML, no `data-test` | `getByRole('button', { name: 'Login' })` |
| ⭐ | `getByPlaceholder()` | Input fields, visible text | `getByPlaceholder('Username')` |
| ⭐ | `locator('#id')` | Unique ID exists | `locator('#user-name')` |
| ❌ Never | CSS classes | Unstable, changes with styling | `.shopping_cart_badge` |

**Configuration:** `testIdAttribute: 'data-test'` in `playwright.config.ts`

**Rationale:** `data-test` attributes are deliberately added for testing, survive UI restyling, and communicate intent clearly. `getByRole()` aligns with Playwright MCP (reads accessibility tree) and promotes accessible design.

---

### Test Design Principles

**Scope discipline:**
- One test = one clear responsibility
- Each test can fail independently
- When test fails, immediately know what broke

**Good example:**
```typescript
test('should add product to cart', async ({ page }) => {
  // ONE thing: verify add to cart works
  await productsPage.addProductToCart('add-to-cart-sauce-labs-backpack')
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1')
})
```

**Bad example:**
```typescript
test('should complete checkout', async ({ page }) => {
  // Too broad: login + add + checkout + payment + confirm
  // If it fails, which step broke?
})
```

**Preconditions:**
- Login handled in `beforeEach` using `LoginPage` and `TEST_USERS`
- Tests start from known state (logged in, on products page)
- No test depends on another test's side effects

**Assertions:**
- Use web-first assertions (`toBeVisible()`, `toHaveText()`)
- Never use one-shot checks (`isVisible()` with `toBe()`)
- No hardcoded `waitForTimeout()`
- Trust Playwright's auto-waiting

---

### Page Object Model Patterns

**Structure:**
```typescript
export class PageName {
  readonly page: Page;
  
  // Elements (locators)
  readonly elementName: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.elementName = page.getByTestId('element-id');
  }
  
  // Actions (methods)
  async actionName(param: string): Promise<void> {
    // Implementation
  }
  
  // Getters (for assertions)
  async getSomething(): Promise<string> {
    return await this.element.textContent() || '';
  }
}
```

**Method naming conventions:**
- Action verbs: `addProductToCart()`, `goToCart()`, `submitForm()`
- Read like sentences: `await loginPage.login(username, password)`
- Specific parameters: `addProductToCart(dataTestId: string)`
- Return types explicit: `Promise<void>` or `Promise<string>`

**What to include in page objects:**
- Elements and actions needed by current tests
- Critical user actions even if not testing yet
- Do NOT over-engineer for "maybe someday" scenarios

**What to exclude:**
- Third-party elements (ads, analytics)
- Decorative/non-interactive elements
- Features not in current test scope

**Philosophy:** Start lean, add when needed. Page objects evolve with test needs.

---

### Test Data Management

**Current pattern:**
```typescript
// tests/test-data/users.ts
export const TEST_USERS = {
  standard: { 
    username: 'standard_user', 
    password: 'secret_sauce' 
  },
  locked: { 
    username: 'locked_out_user', 
    password: 'secret_sauce' 
  }
}
```

**Usage in tests:**
```typescript
await loginPage.login(
  TEST_USERS.standard.username, 
  TEST_USERS.standard.password
)
```

**Benefits:**
- One place to update credentials
- Type-safe with TypeScript
- Self-documenting (names explain purpose)
- Reusable across all tests

---

### CLAUDE.md - AI Collaboration Guide

**Purpose:** Tells Claude Code the project's conventions before generating code. Prevents common mistakes and ensures consistency.

**Key sections:**
1. **Project purpose** - AI-native testing framework
2. **Locator strategy** - Priority order, never use CSS classes
3. **Test design principles** - Scope discipline, no timeouts, beforeEach for preconditions
4. **AI-native workflow** - Human reviews locators, scope, maintainability
5. **Future MCP integration** - Role-based locators support MCP, project dependencies for auth
6. **Reporting** - Screenshots on failure, HTML reports, trace viewer

**Planned addition:** AI review checklist — how to verify AI-generated code before accepting it, based on testing expert practices. To be added to CLAUDE.md once designed.

---

### Git Workflow

**Commit message patterns:**
- `Add [feature]` - new functionality
- `Update [file/feature]` - modifications
- `Fix [issue]` - bug fixes
- `Refactor [component]` - restructuring without changing behavior

**Recent commits tell the story:**
- "Initial Playwright setup with TypeScript and GitHub Actions"
- "Add docs folder structure for learning journal and concepts"
- "Implement Page Object Model with LoginPage and test data abstraction"
- "Refactor add-to-cart to use LoginPage and TEST_USERS"

---

## 7. Open Questions & Items to Revisit

### After SauceDemo Complete
- [ ] Add `eslint-plugin-playwright` for automated anti-pattern detection
- [ ] Test framework on a second application to validate portability
- [ ] Consider adding screenshot/video configuration examples

### ProductsPage Design Questions (Pending Resolution)
**Locator abstraction level:**
- Decision made: Use exact `data-test` values, no string conversion
- Rationale: Simplicity, explicitness, zero conversion bugs
- Example: `addProductToCart("add-to-cart-sauce-labs-backpack")`
- Alternative considered: Friendly names with conversion (rejected for learning phase)

**Edge cases identified:**
- Empty cart (0 items) - boundary
- Rapid Add to cart clicks - timing edge
- All products in cart (max state) - boundary

**Not edge cases (functional tests):**
- Filter then add to cart - normal workflow
- Button state changes - core behavior
- Navigation behaviors - expected functionality

### Checkout Flow Design (Not Yet Started)
**Open decision:** One complete journey test vs. three separate tests
- **Option A (recommended):** One test with `test.step()` for each phase
- **Option B:** Three tests with preconditions (more granular failure info)
- Likely choosing Option A per Playwright best practices article

**Page objects needed:**
- CheckoutInfoPage (form: first name, last name, zip)
- CheckoutOverviewPage (price summary, finish button)
- ConfirmationPage (success message)

### API Testing Approach (Week 2)
- Use Playwright's built-in API testing (TypeScript, not Java/Python)
- Test SauceDemo API endpoints if available, otherwise JSONPlaceholder
- Document in `docs/learning/04-api-testing-basics.md`

---

## Key Resources Referenced

**Industry validation:**
- Debbie O'Brien NDC talk: "Supercharged Testing: AI-Powered Workflows with Playwright + MCP"
- Playwright best practices: "17 Playwright Testing Mistakes You Should Avoid" (Yevhen Laichenkov)
- Garry Tan's Claude Code review approach (structured self-review prompts)

**Learning approach:**
- Three-layer method: Concept → AI in Action → Verification
- Manual inspection before automation
- Double verification (human + AI) for page analysis
- Question abstractions rather than accept them

**Testing instincts from manual testing background:**
- V&V thinking from pharmaceutical validation documentation
- Risk-based prioritization
- Edge case identification (boundaries, extremes, timing)
- Test scope discipline

---

**Next action:** Complete ProductsPage manual inspection and paste findings to continue implementation.
