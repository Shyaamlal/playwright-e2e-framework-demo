# Playwright E2E Framework - AI-Native Testing

A Playwright TypeScript framework demonstrating an AI-native approach to test automation, where human test strategy meets AI-powered implementation.

---

## Overview

This framework demonstrates an **AI-native workflow** for test automation. In this approach:

- **The tester acts as strategist** - defining scope, acceptance criteria, and test design decisions
- **Claude Code generates and maintains the test code** - handling implementation, debugging, and maintenance
- **The tester reviews and validates** - ensuring quality, locator choices, and test design align with best practices

This framework demonstrates how strategic testing expertise can be combined with AI-powered code generation to accelerate development and maintain test suites efficiently.

---

## Framework Capabilities

### Core Testing Features
- **E2E testing with Playwright** - Browser automation across Chrome, Firefox, and WebKit
- **Thoughtful locator strategy** - Prioritizing `data-test` attributes and role-based locators over fragile CSS selectors
- **Test design principles** - Single responsibility tests, proper setup/teardown, meaningful assertions
- **CI/CD integration** - Automated test execution via GitHub Actions on every push and PR

### AI-Native Development Practices
- **Strategic collaboration with AI** - Clear requirements definition and systematic code review
- **Documented learning** - Insights captured in `docs/learning/` to build reusable knowledge
- **Quality gates** - Tests verified across browsers, locator choices reviewed, root causes fixed (never masking failures)

---

## Tech Stack

- **Playwright** - Modern E2E testing framework
- **TypeScript** - Type-safe test development
- **GitHub Actions** - CI/CD pipeline
- **HTML Reporter** - Visual test results with screenshots on failure
- **Trace Viewer** - Debugging failed tests with detailed execution traces

---

## Running Tests Locally

```bash
# Install dependencies
npm install

# Run all tests
npx playwright test

# Run tests in UI mode (interactive debugging)
npx playwright test --ui

# Run specific test file
npx playwright test tests/add-to-cart.spec.ts

# View HTML report
npx playwright show-report
```

---

## Project Structure

```
playwright-e2e-framework-demo/
├── tests/                    # Test files (*.spec.ts)
├── docs/
│   ├── learning/            # Daily learning notes
│   └── concepts/            # Testing concepts and glossary
├── .github/workflows/       # CI/CD configuration
├── playwright.config.ts      # Playwright configuration
├── CLAUDE.md               # AI collaboration guide
└── README.md               # This file
```

---

## AI-Native Approach

This framework is inspired by [Debbie O'Brien's NDC talk on AI-powered workflows with Playwright and MCP](https://youtu.be/Numb52aJkJw). The approach recognizes that AI excels at code generation and maintenance, while human testers excel at strategic thinking and quality judgment.

This separation of concerns enables:
- Focus on test strategy and coverage decisions
- Rapid implementation and debugging through AI assistance
- High code quality through systematic review
- Efficient test suite scaling

---

## Development Status

This framework is under **active development**. Current implementation includes:
- ✅ Core Playwright setup with TypeScript
- ✅ Locator best practices (data-test attributes, role-based selectors)
- ✅ CI/CD pipeline with GitHub Actions
- ✅ HTML reporting and screenshot capture
- 🚧 Expanding test coverage
- 🚧 Authentication patterns with project dependencies
- 🚧 Future MCP integration for advanced AI workflows

---
