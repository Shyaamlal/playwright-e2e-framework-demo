# Review Checklist — AI-Generated Code

A living checklist built section by section from experience, not written top-down. Each section is added when we work through that topic in practice.

---

## Section 1: Locators (Page Object review)

Use when reviewing a page object file (e.g. `products-page.ts`) before accepting AI-generated locators.

- [ ] Locator uses `data-test` attribute via `getByTestId()` where available
- [ ] If no `data-test`, `getByRole()` is used instead
- [ ] If neither, a semantic fallback is used (`getByLabel`, `getByPlaceholder`, `getByText`, `#id`)
- [ ] CSS class selectors only used as last resort — flagged with a comment explaining why

---

*More sections to be added as we work through assertions, scope, structure, and wait strategy.*
