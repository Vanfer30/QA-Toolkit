import { Given, When, Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';

// Background steps
Given("I am logged in as an administrator", () => {
  cy.visit("/login");
  cy.get('[data-testid="username-input"]').type("admin@example.com");
  cy.get('[data-testid="password-input"]').type("adminpassword");
  cy.get('[data-testid="login-button"]').click();
  cy.url().should("include", "/dashboard");
});

Given("I am on the user management page", () => {
  cy.visit("/admin/users");
  cy.get('[data-testid="user-management-page"]').should("be.visible");
});

// Create user scenario steps
When("I click the {string} button", (buttonText: string) => {
  cy.contains("button", buttonText).click();
});

When("I fill in the user details with:", (dataTable: DataTable) => {
  const userData = dataTable.rowsHash();
  
  cy.get('[data-testid="username-field"]').type(userData.Username);
  cy.get('[data-testid="name-field"]').type(userData.Name);
  cy.get('[data-testid="role-select"]').select(userData.Role);
});

When("I click the {string} button", (buttonText: string) => {
  cy.contains("button", buttonText).click();
});

Then("I should see a success message", () => {
  cy.get('[data-testid="success-message"]').should("be.visible");
  cy.get('[data-testid="success-message"]').should("contain", "Success");
});

Then("the new user should appear in the user list", () => {
  cy.get('[data-testid="user-list"]').should("contain", "newuser@test.com");
});

// Edit user scenario steps
When("I select a user from the list", () => {
  cy.get('[data-testid="user-row"]').first().click();
});

When("I update the user name to {string}", (newName: string) => {
  cy.get('[data-testid="name-field"]').clear().type(newName);
});

Then("the user name should be updated in the list", () => {
  cy.get('[data-testid="user-list"]').should("contain", "Jane Smith");
});

// Delete user scenario steps
When("I confirm the deletion", () => {
  cy.get('[data-testid="confirm-delete-button"]').click();
});

Then("the user should be removed from the list", () => {
  cy.get('[data-testid="user-list"]').should("not.contain", "deleteduser@test.com");
});
