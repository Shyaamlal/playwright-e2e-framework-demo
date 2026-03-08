# Testing Process

Systematic approach to test automation from project setup through continuous improvement. Tool-agnostic — applies whether using Playwright, Selenium, Cypress, or any other framework.

---

## Phase 1: Project Setup

### Initial Assessment
- [ ] What application am I testing?
- [ ] What tech stack? (Web, mobile, API, desktop)
- [ ] What's already automated? What's manual?
- [ ] What testing tools/frameworks are in use?
- [ ] What's the deployment pipeline? (CI/CD exists?)
- [ ] Who are the stakeholders? (Dev, PM, other QA)

### Tool Selection
**For web applications:**
- Modern framework with good documentation → Playwright/Cypress
- Legacy app with complex scenarios → Selenium
- Team already uses X → Match the team

**For API testing:**
- TypeScript/JavaScript stack → Playwright API / Supertest
- Python stack → Pytest + Requests

### Setup Checklist
- [ ] Install runtime (Node.js/Python/Java)
- [ ] Install testing framework
- [ ] Configure version control (Git)
- [ ] Create folder structure (tests/, pages/, test-data/, docs/)
- [ ] Initialize CI/CD (GitHub Actions/Jenkins/etc)
- [ ] Create project documentation (README, CLAUDE.md if using AI)

---

## Phase 2: Test Strategy

### Risk-Based Prioritization
For each feature/flow, ask:
1. What's the business impact if this breaks?
2. How complex is this to test manually?
3. How frequently does this change?
4. What's the ROI of automating this?

| Impact | Complexity | Priority |
|--------|-----------|----------|
| High | High | Automate First |
| High | Low | Automate |
| Low | High | Manual or Later |
| Low | Low | Consider Skip |

### Coverage Planning
- [ ] Critical user journeys identified
- [ ] Happy paths defined
- [ ] Error scenarios mapped
- [ ] Edge cases documented
- [ ] Scope clearly defined (what's IN, what's OUT)

---

## Phase 3: Page Object Analysis

For each page, work through these steps before writing any code.

### Step 1 — Identify Purpose
- What is the user trying to accomplish on this page?
- What is the page called in product language?

### Step 2 — Map Interactive Elements
| Element | Type | Locator | Purpose |
|---------|------|---------|---------|
| Username field | Input | `data-test="username"` | Login credential |
| Add to cart | Button (multiple) | `data-test="add-to-cart-{product}"` | Add item |

### Step 3 — Map Display Elements
| Element | Type | Used For |
|---------|------|----------|
| Error message | Text | Validation feedback |
| Cart badge | Number | Items in cart |

### Step 4 — Define Actions (Methods)
Actions should:
- Use clear verb names: `login`, `addToCart`, `submitOrder`
- Accept necessary parameters: `addToCart(productSlug: string)`
- Return useful values if needed: `getCartCount(): Promise<number>`

### Step 5 — Inspect Locators
Open DevTools for each element:
- `data-test` attribute exists? → Use `getByTestId()`
- No `data-test`? → Use `getByRole()` (accessibility tree)
- Neither? → Document the gap, use CSS/XPath as last resort

### Step 6 — Double Verification (AI-Native Workflow)
Run both human and AI inspection, then compare:
- **Human inspection** — inspect across different states (add item to cart, trigger errors). Catches dynamic elements.
- **AI inspection** — scrape all `data-test` attributes on page load. Catches elements you visually missed.
- **Compare** — what did each miss? Resolve disagreements. Build final element list.

### Step 7 — Edge Cases
- What if the page is empty?
- What if there are 0 items vs 100?
- What errors can appear?
- What loading states exist?
- What elements only appear after a state change?

---

## Phase 4: Locator Strategy

### Decision Tree
```
Does element have data-test attribute?
  YES → Use getByTestId('value')
  NO ↓

Is element semantic HTML with clear role?
  YES → Use getByRole('button', { name: 'Login' })
  NO ↓

Does element have unique, stable ID?
  YES → Use locator('#unique-id')
  NO ↓

Can you use visible text reliably?
  YES → Use getByText('exact text')
  NO ↓

Last resort: CSS selector or XPath
  Document why, plan to request data-test attribute
```

### Locator Stability Checklist
- [ ] Does NOT depend on CSS classes
- [ ] Does NOT depend on DOM hierarchy
- [ ] Does NOT use index/position numbers
- [ ] DOES reflect user-visible behaviour
- [ ] DOES survive UI restyling

---

## Phase 5: Test Design

### Test Scope Rules
Each test should:
- [ ] Have ONE clear purpose
- [ ] Have ONE thing that can fail
- [ ] Be independent (can run alone)
- [ ] Be repeatable (same result every time)
- [ ] Have clear preconditions
- [ ] Have meaningful assertions

### Test Structure (Arrange / Act / Assert)
```typescript
test('should [expected behaviour] when [condition]', async ({ page }) => {
  // ARRANGE — set up preconditions (usually in beforeEach)

  // ACT — perform the action
  await productsPage.addToCart('sauce-labs-backpack');

  // ASSERT — verify the outcome
  await expect(productsPage.cartBadge).toHaveText('1');
});
```

### Precondition Patterns
- Login → `beforeEach` hook using page object + TEST_USERS
- Specific data state → test data setup in `test-data/`
- Clean environment → `afterEach` cleanup if needed

---

## Phase 6: Assertion Design

After every action, ask:
1. What MUST be true if this worked?
2. What could be TRUE but WRONG? (right format, wrong data)
3. What side effects should NOT happen?

### Assertion Reference

| What to check | Playwright assertion |
|---------------|----------------------|
| Element appears | `toBeVisible()` |
| Element hidden | `toBeHidden()` |
| Exact text | `toHaveText('exact match')` |
| Contains text | `toContainText('partial')` |
| Input value | `toHaveValue('value')` |
| Element enabled | `toBeEnabled()` |
| Element disabled | `toBeDisabled()` |
| Count | `toHaveCount(3)` |
| URL changed | `toHaveURL(/pattern/)` |

---

## Phase 7: AI Collaboration

### When to Use AI
- Generating page object and test boilerplate
- Debugging failing tests
- Creating test data
- Writing documentation

### When NOT to Use AI
- Defining test strategy (your job)
- Choosing what to test (risk assessment is yours)
- Verifying test quality (your judgment)
- Making architecture decisions
- Understanding business requirements

### Prompting Framework
```
Context: [What are you testing, which page/API]
Scope: [Exactly what to build, what NOT to build]
Acceptance Criteria: [Specific assertions required]
Locators: [Specify data-test attributes if known]
Constraints: [What conventions to follow]
```

### Two-Stage Review Process

**Stage 1 — Claude self-reviews** before presenting code (checklist in `CLAUDE.md`)

**Stage 2 — Human review** before committing:

| Category | What to check |
|----------|--------------|
| **Locators** | `data-test` via `getByTestId()` where available. No CSS classes. Locators in page object, not test. |
| **Assertions** | Verify state change, not just visibility. Would fail if feature broke. None inside page object methods. |
| **Scope** | Only what was requested. One responsibility per test. Tests are independent. |
| **Wait strategy** | No `waitForTimeout()`. No `{ force: true }`. Playwright auto-waiting trusted. |
| **Structure** | Login in `beforeEach`. Test data from `test-data/`, not hardcoded. |

Full human review reference: `docs/concepts/process.md` (this file, Phase 7)

---

## Phase 8: Execution & Maintenance

### Running Tests
```bash
npx playwright test                          # run all tests
npx playwright test tests/add-to-cart.spec.ts  # specific file
npx playwright test --ui                     # UI mode for debugging
npx playwright show-report                   # view HTML report
```

### When Tests Fail
```
1. Is this a real bug?
   YES → File bug, mark test as known issue
   NO ↓

2. Did the app change legitimately?
   YES → Update test
   NO ↓

3. Is the test flaky?
   YES → Investigate timing/state issues
   NO ↓

4. Is the environment different?
   YES → Check config, data, credentials
```

### Maintenance Triggers
- App UI changes → update page objects
- Requirements change → update test scope
- Test becomes unreliable → refactor or remove

---

## Phase 9: Continuous Improvement

- [ ] Which tests provide most value?
- [ ] Which tests are too expensive to maintain?
- [ ] What gaps exist in coverage?
- [ ] What can be simplified?
- [ ] What new patterns have emerged? → Document in `docs/`
- [ ] Have AI collaboration conventions changed? → Update `CLAUDE.md`

---

## Quick Reference

### Test or Don't Test?
| Scenario | Automate? |
|----------|-----------|
| Critical user flow, stable requirements | YES |
| Complex calculation that rarely changes | YES |
| One-time migration script | NO |
| Exploratory testing scenario | NO |
| UI that changes constantly | MAYBE |

### Page Object or Not?
| Scenario | Create Page Object? |
|----------|---------------------|
| Page used by multiple tests | YES |
| Complex page with many actions | YES |
| One-off scenario, single test | NO — inline is fine |
| Third-party page you don't control | NO |
