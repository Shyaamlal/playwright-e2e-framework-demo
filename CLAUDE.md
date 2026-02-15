# Playwright E2E Framework - AI-Native Testing Guide

This document defines the testing philosophy, conventions, and AI collaboration approach for this Playwright TypeScript framework.

---

## 1. Project Purpose

This is a Playwright TypeScript framework built using an **AI-native approach**. The human acts as test strategist and AI generates, fixes and maintains test code. Based on insights from Debbie O'Brien's NDC talk on AI-powered workflows with Playwright and MCP.

**Key Characteristics:**
- AI generates and maintains test code under human strategic direction
- Human defines test scope and acceptance criteria
- AI handles implementation details, debugging, and maintenance
- Continuous learning and improvement through documented patterns

---

## 2. Locator Strategy

**Priority Order for Locators:**

1. **`data-test` attributes** (ALWAYS PREFERRED)
   - `getByTestId()` is configured to use `data-test` attribute in `playwright.config.ts`
   - Example: `page.getByTestId('shopping-cart-badge')`
   - Alternative syntax: `page.locator('[data-test="shopping-cart-badge"]')`

2. **Role-based locators** (NEXT PREFERENCE)
   - Use `getByRole()` when `data-test` is unavailable
   - Example: `page.getByRole('button', { name: 'Login' })`
   - Reflects accessibility tree - the same way Playwright MCP reads the page
   - Promotes accessible UI design

3. **NEVER use CSS class selectors as locators**
   - ❌ Bad: `page.locator('.shopping_cart_badge')`
   - ✅ Good: `page.getByTestId('shopping-cart-badge')`

**Configuration:**
```typescript
// playwright.config.ts should include:
use: {
  testIdAttribute: 'data-test'
}
```

---

## 3. Test Design Principles

### Scope Discipline
- **Never add tests beyond what is explicitly requested**
- If additional tests seem valuable, suggest them but do not create them
- Each test should have one clear responsibility
- Stay within defined acceptance criteria

### Async Handling
- **Never add timeouts** - Playwright auto-waits
- Trust Playwright's built-in waiting mechanisms
- Only add explicit waits for specific race conditions (rare)

### Test Structure
- **Login and prerequisites belong in `beforeEach` or fixtures**, never inside the test itself
- Keep test body focused on the specific behavior being verified
- Use descriptive test names that explain the expected behavior

### Assertions
- Use specific, meaningful assertions
- Prefer multiple focused assertions over broad checks
- Always verify state changes explicitly

---

## 4. AI-Native Workflow

### Collaboration Model
- **Human Role:** Test strategist, scope definer, reviewer
- **AI Role:** Test generator, debugger, maintainer

### Process
1. Human defines test scope and acceptance criteria
2. AI generates test implementation
3. AI verifies tests pass across all browsers
4. Human reviews locator choices and test design
5. AI iterates based on feedback

### Quality Gates
- Tests are verified by the human after generation
- Locator choices are always reviewed against available `data-test` attributes
- **When fixing tests, never mark failing tests as passing by deleting assertions**
- Failing tests indicate real issues - fix the root cause, not the assertion

### Memory and Learning
- Document patterns in `docs/learning/` for daily insights
- Document concepts in `docs/concepts/` for reusable knowledge
- Update this CLAUDE.md when conventions evolve

---

## 5. Future MCP Integration

### Playwright MCP Compatibility
- Locator strategy using `getByRole()` supports Playwright MCP which reads the accessibility tree
- MCP provides AI agents direct access to browser automation via accessibility APIs
- Our role-based locator preference aligns with MCP's page understanding model

### Authentication Strategy
- Project dependencies pattern will be used for authentication
- Protects credentials from LLM context
- Enables secure, reusable login state across tests
- Reference: [Playwright Authentication Guide](https://playwright.dev/docs/auth)

---

## 6. Folder Structure

```
playwright-e2e-framework-demo/
├── tests/                    # All test files (*.spec.ts)
├── docs/
│   ├── learning/            # Daily learning notes
│   └── concepts/            # Testing concepts and glossary
├── .github/
│   └── workflows/           # CI/CD configuration
├── playwright.config.ts      # Playwright configuration
├── package.json             # Project dependencies
└── CLAUDE.md               # This file - AI collaboration guide
```

### Naming Conventions
- Test files: `{feature-name}.spec.ts`
- Test suites: Use descriptive `test.describe()` blocks
- Test names: Start with "should" and describe expected behavior

---

## 7. Reporting

### Current Configuration
- **HTML reports** generated after each run
- Located in `playwright-report/` directory
- View with: `npx playwright show-report`
- **Screenshots on failure** automatically captured
- Configured with: `screenshot: 'only-on-failure'`

### Debugging Tools
- **Trace viewer** used for debugging failed tests
- Traces captured on first retry: `trace: 'on-first-retry'`
- View traces: `npx playwright show-trace trace.zip`

### Planned Enhancements
- Video recording on failure (to be configured)
- Custom reporter integration for CI/CD

### Running Reports
```bash
# Run tests with HTML report
npx playwright test

# Show latest HTML report
npx playwright show-report

# Run tests with UI mode for debugging
npx playwright test --ui

# Run specific test file
npx playwright test tests/add-to-cart.spec.ts
```

---

## Quick Reference

**Good Practices:**
- ✅ Use `data-test` attributes for locators
- ✅ Keep tests focused on single responsibility
- ✅ Put setup in `beforeEach` hooks
- ✅ Trust Playwright's auto-waiting
- ✅ Verify all acceptance criteria explicitly

**Anti-Patterns:**
- ❌ Never use CSS class selectors
- ❌ Never add tests beyond requested scope
- ❌ Never add manual timeouts
- ❌ Never put login logic inside test body
- ❌ Never delete assertions to make tests pass

---

*This document evolves with the project. Update it when new patterns emerge or conventions change.*
