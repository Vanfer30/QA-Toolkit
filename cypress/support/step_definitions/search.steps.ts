import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Background step
Given("I am on the search page", () => {
  cy.visit("/search");
  cy.get('[data-testid="search-page"]').should("be.visible");
});

// Scenario outline steps
When("I search for {string}", (searchTerm: string) => {
  cy.get('[data-testid="search-input"]').type(searchTerm);
  cy.get('[data-testid="search-button"]').click();
});

Then("I should see {string} results", (expectedCount: string) => {
  const count = parseInt(expectedCount);
  if (count === 0) {
    cy.get('[data-testid="no-results-message"]').should("be.visible");
  } else {
    cy.get('[data-testid="search-results"]').should("be.visible");
    cy.get('[data-testid="result-item"]').should("have.length", count);
  }
});

Then("the results should contain {string}", (searchTerm: string) => {
  if (searchTerm !== "invalid") {
    cy.get('[data-testid="result-item"]').should("contain", searchTerm);
  }
});

// Basic search functionality
When("I click the search button", () => {
  cy.get('[data-testid="search-button"]').click();
});

Then("I should see search results", () => {
  cy.get('[data-testid="search-results"]').should("be.visible");
});

Then("the results should be relevant to {string}", (searchTerm: string) => {
  cy.get('[data-testid="result-item"]').should("contain", searchTerm);
});

// Special characters search
Then("the results should handle special characters properly", () => {
  cy.get('[data-testid="result-item"]').should("be.visible");
  // Additional validation for special character handling
  cy.get('[data-testid="search-input"]').should("have.value", "test@example.com");
});

// Empty search
When("I click the search button without entering any term", () => {
  cy.get('[data-testid="search-input"]').clear();
  cy.get('[data-testid="search-button"]').click();
});

Then("I should see a message asking me to enter a search term", () => {
  cy.get('[data-testid="empty-search-message"]').should("be.visible");
  cy.get('[data-testid="empty-search-message"]').should("contain", "Please enter a search term");
});

// Long search term
When("I type a very long search term into search", () => {
  const longSearchTerm = "a".repeat(1000); // Very long search term
  cy.get('[data-testid="search-input"]').type(longSearchTerm);
});

Then("the search should handle long terms properly", () => {
  cy.get('[data-testid="search-results"]').should("be.visible");
  // Additional validation for long term handling
  cy.get('[data-testid="search-input"]').should("have.value.length.greaterThan", 100);
});
