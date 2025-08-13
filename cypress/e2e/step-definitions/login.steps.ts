import { Given, When, Then, Before, After } from '@badeball/cypress-cucumber-preprocessor';

// Background step
Given("I am on the login page", () => {
  cy.visit("/login"); // Update this URL to match your application
});

// Successful login scenario steps
When("I enter valid username and password", () => {
  cy.get('[data-testid="username-input"]').type("validuser@example.com");
  cy.get('[data-testid="password-input"]').type("validpassword123");
});

When("I click the login button", () => {
  cy.get('[data-testid="login-button"]').click();
});

Then("I should be redirected to the dashboard", () => {
  cy.url().should("include", "/dashboard");
});

Then("I should see a welcome message", () => {
  cy.get('[data-testid="welcome-message"]').should("be.visible");
  cy.get('[data-testid="welcome-message"]').should("contain", "Welcome");
});

// Failed login scenario steps
When("I enter invalid username and password", () => {
  cy.get('[data-testid="username-input"]').type("invaliduser@example.com");
  cy.get('[data-testid="password-input"]').type("wrongpassword");
});

Then("I should see an error message", () => {
  cy.get('[data-testid="error-message"]').should("be.visible");
  cy.get('[data-testid="error-message"]').should("contain", "Invalid credentials");
});

Then("I should remain on the login page", () => {
  cy.url().should("include", "/login");
});

// Empty credentials scenario steps
When("I leave username and password fields empty", () => {
  cy.get('[data-testid="username-input"]').clear();
  cy.get('[data-testid="password-input"]').clear();
});

Then("I should see validation error messages", () => {
  cy.get('[data-testid="username-error"]').should("be.visible");
  cy.get('[data-testid="password-error"]').should("be.visible");
});
