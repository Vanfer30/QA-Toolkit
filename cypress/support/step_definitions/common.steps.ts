import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Common navigation steps
Given("I am on the {string} page", (pageName: string) => {
  const pageUrls: { [key: string]: string } = {
    "login": "/login",
    "dashboard": "/dashboard",
    "user management": "/admin/users",
    "profile": "/profile",
    "settings": "/settings"
  };
  
  cy.visit(pageUrls[pageName.toLowerCase()] || `/${pageName.toLowerCase().replace(/\s+/g, '-')}`);
});

// Common interaction steps
When("I click on {string}", (elementText: string) => {
  cy.contains(elementText).click();
});

When("I type {string} into {string}", (text: string, fieldName: string) => {
  const fieldSelectors: { [key: string]: string } = {
    "username": '[data-testid="username-input"]',
    "password": '[data-testid="password-input"]',
    "email": '[data-testid="email-input"]',
    "search": '[data-testid="search-input"]'
  };
  
  cy.get(fieldSelectors[fieldName.toLowerCase()] || `[data-testid="${fieldName.toLowerCase()}-input"]`).type(text);
});

When("I clear the {string} field", (fieldName: string) => {
  const fieldSelectors: { [key: string]: string } = {
    "username": '[data-testid="username-input"]',
    "password": '[data-testid="password-input"]',
    "email": '[data-testid="email-input"]',
    "search": '[data-testid="search-input"]'
  };
  
  cy.get(fieldSelectors[fieldName.toLowerCase()] || `[data-testid="${fieldName.toLowerCase()}-input"]`).clear();
});

// Common assertion steps
Then("I should see {string}", (text: string) => {
  cy.contains(text).should("be.visible");
});

Then("I should not see {string}", (text: string) => {
  cy.contains(text).should("not.exist");
});

Then("I should be on the {string} page", (pageName: string) => {
  const pageUrls: { [key: string]: string } = {
    "login": "/login",
    "dashboard": "/dashboard",
    "user management": "/admin/users",
    "profile": "/profile",
    "settings": "/settings"
  };
  
  cy.url().should("include", pageUrls[pageName.toLowerCase()] || `/${pageName.toLowerCase().replace(/\s+/g, '-')}`);
});

// Removed duplicate step definitions to avoid conflicts

// Common form steps
When("I submit the form", () => {
  cy.get('form').submit();
});

When("I press the {string} key", (key: string) => {
  cy.get('body').type(`{${key}}`);
});

// Common waiting steps
Then("I wait for the page to load", () => {
  cy.get('[data-testid="loading-spinner"]').should("not.exist");
});
