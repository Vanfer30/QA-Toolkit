import { Given, When, Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';

// Background step
Given("I am on the registration page", () => {
  cy.visit("/register");
  cy.get('[data-testid="registration-page"]').should("be.visible");
});

// Registration form steps
When("I fill in the registration form with:", (dataTable: DataTable) => {
  const formData = dataTable.rowsHash();
  
  cy.get('[data-testid="first-name-input"]').type(formData['First Name']);
  cy.get('[data-testid="last-name-input"]').type(formData['Last Name']);
  cy.get('[data-testid="email-input"]').type(formData['Email']);
  cy.get('[data-testid="password-input"]').type(formData['Password']);
  cy.get('[data-testid="confirm-password-input"]').type(formData['Confirm Password']);
});

When("I accept the terms and conditions", () => {
  cy.get('[data-testid="terms-checkbox"]').check();
});

When("I click the {string} button", (buttonText: string) => {
  cy.contains("button", buttonText).click();
});

// Success scenario steps
Then("I should see a success message", () => {
  cy.get('[data-testid="success-message"]').should("be.visible");
  cy.get('[data-testid="success-message"]').should("contain", "Registration successful");
});

Then("I should be redirected to the login page", () => {
  cy.url().should("include", "/login");
});

// Error scenario steps
Then("I should see an error message", () => {
  cy.get('[data-testid="error-message"]').should("be.visible");
});

Then("the error should indicate the email already exists", () => {
  cy.get('[data-testid="error-message"]').should("contain", "email already exists");
});

// Validation error steps
Then("I should see validation error messages", () => {
  cy.get('[data-testid="validation-error"]').should("be.visible");
});

Then("the error should indicate password mismatch", () => {
  cy.get('[data-testid="validation-error"]').should("contain", "passwords do not match");
});
