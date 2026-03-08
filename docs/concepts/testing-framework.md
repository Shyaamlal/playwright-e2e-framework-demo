# Test Automation Framework - Complete Process

This document captures the systematic approach to test automation 
from project setup through execution. Usable with or without AI tools.

---

## Phase 1: Project Setup

### Initial Assessment
- [ ] What application am I testing?
- [ ] What tech stack? (Web, mobile, API, desktop)
- [ ] What's already automated? What's manual?
- [ ] What testing tools/frameworks are in use?
- [ ] What's the deployment pipeline? (CI/CD exists?)
- [ ] Who are the stakeholders? (Dev, PM, other QA)

### Tool Selection Decision Tree
**For web applications:**
- Modern framework with good documentation → Playwright/Cypress
- Legacy app with complex scenarios → Selenium
- Team already uses X → Match the team

**For API testing:**
- TypeScript/JavaScript stack → Playwright API / Supertest
- Java stack → REST Assured
- Python stack → Pytest + Requests

### Setup Checklist
- [ ] Install runtime (Node.js/Python/Java)
- [ ] Install testing framework
- [ ] Configure version control (Git)
- [ ] Create folder structure (tests/, pages/, test-data/)
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

**Priority Matrix:**
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

### For Each Page/Screen

**1. Identify Purpose**
- What is the user trying to accomplish?
- What's the page called in product language?

**2. Map Interactive Elements**
| Element | Type | Count | Locator | Purpose |
|---------|------|-------|---------|---------|
| Username field | Input | 1 | data-test="username" | Login credential |
| Add to cart | Button | Multiple | data-test="add-to-cart-{product}" | Add item |

**3. Map Display Elements**
| Element | Type | Used For |
|---------|------|----------|
| Error message | Text | Validation feedback |
| Cart count | Number | Items in cart |

**4. Define Actions (Methods)**
Actions should:
- Use clear verb names (login, addToCart, submitOrder)
- Accept necessary parameters (username, productName)
- Return useful values if needed (order confirmation number)

**5. Inspect Locators**
Open DevTools for each element:
- data-test attribute exists? → Use getByTestId()
- No data-test? → Use getByRole() (accessibility tree)
- Neither reliable? → Document the gap, use CSS/XPath as last resort

**6. Edge Cases**
- What if page is empty?
- What if there are 100 items vs 1?
- What errors can appear?
- What loading states exist?

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
- [ ] DOES reflect user-visible behavior
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

### Test Structure Template
```
test('should [expected behavior] when [condition]', async () => {
  // ARRANGE - Set up preconditions
  
  // ACT - Perform the action
  
  // ASSERT - Verify the outcome
})
```

### Precondition Patterns
- Login → beforeEach hook
- Specific data state → Test data setup
- Clean environment → afterEach cleanup

---

## Phase 6: Assertion Design

### What To Assert

After every action, ask:
1. What MUST be true if this worked?
2. What could be TRUE but WRONG? (right format, wrong data)
3. What side effects should NOT happen?

### Assertion Selection Guide

**Visibility:**
- Element appears → `toBeVisible()`
- Element hidden → `toBeHidden()`

**Content:**
- Exact text → `toHaveText('exact match')`
- Contains text → `toContainText('partial')`
- Input value → `toHaveValue('value')`

**State:**
- Interactive → `toBeEnabled()`
- Disabled → `toBeDisabled()`
- Checked → `toBeChecked()`

**Quantity:**
- Exact count → `toHaveCount(3)`
- At least → `toBeGreaterThanOrEqual(1)`

**Navigation:**
- URL changed → `toHaveURL(/pattern/)`

---

## Phase 7: AI Collaboration (If Available)

### When To Use AI
- Generating boilerplate code
- Converting manual test cases to automation
- Debugging failing tests
- Creating test data
- Writing documentation

### When NOT To Use AI
- Defining test strategy (your job)
- Choosing what to test (risk assessment)
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

### Verification Checklist (AI Output)
- [ ] Locators use correct strategy
- [ ] Scope not exceeded
- [ ] Assertions are meaningful
- [ ] No hardcoded waits/timeouts
- [ ] Follows project conventions
- [ ] Code is readable and maintainable

---

## Phase 8: Execution & Maintenance

### Running Tests
- Locally during development
- In CI/CD on every commit
- Before releases (full regression)
- On schedule (nightly/weekly)

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
- App UI changes → Update page objects
- Requirements change → Update test scope
- New team members → Update documentation
- Test becomes unreliable → Refactor or remove

---

## Phase 9: Continuous Improvement

### Regular Reviews
- [ ] Which tests provide most value?
- [ ] Which tests are too expensive to maintain?
- [ ] What gaps exist in coverage?
- [ ] What can be simplified?

### Knowledge Transfer
- Document patterns in this framework
- Create examples for common scenarios
- Update CLAUDE.md with new conventions
- Share learnings with team

---

## Quick Reference Decision Matrices

### Test or Don't Test?
| Scenario | Automate? |
|----------|-----------|
| Critical user flow, stable requirements | YES |
| Complex calculation that rarely changes | YES |
| One-time migration script | NO |
| Exploratory testing scenario | NO |
| UI that changes constantly | MAYBE - consider contract testing |

### Page Object or Not?
| Scenario | Create Page Object? |
|----------|---------------------|
| Page used by multiple tests | YES |
| Complex page with many actions | YES |
| One-off scenario, single test | NO - inline is fine |
| Third-party page you don't control | NO |

---

*This framework is tool-agnostic. Principles apply whether 
using Playwright, Selenium, Cypress, REST Assured, or any 
other testing framework.*