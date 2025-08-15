# Gherkin/Cucumber E2E Testing

This directory contains the Gherkin/Cucumber feature files and step definitions for end-to-end testing.

## Directory Structure

```
cypress/e2e/
├── features/                    # Feature files (.feature)
│   ├── login.feature           # Login functionality
│   └── user-management.feature # User management functionality
├── step-definitions/           # Step definition files (.ts)
│   ├── common.steps.ts         # Shared/common steps
│   ├── login.steps.ts          # Login-specific steps
│   └── user-management.steps.ts # User management steps
└── README.md                   # This file
```

## Feature Files

Feature files use Gherkin syntax and should follow these conventions:

### Structure
- **Feature**: High-level description of the functionality
- **Background**: Steps that run before each scenario
- **Scenario**: Individual test cases
- **Given**: Preconditions
- **When**: Actions
- **Then**: Assertions

### Best Practices
1. Use descriptive feature and scenario names
2. Keep scenarios focused on one specific behavior
3. Use data tables for complex data input
4. Use scenario outlines for parameterized tests
5. Include user stories in feature descriptions

### Example
```gherkin
Feature: Login Functionality
  As a user
  I want to be able to log in to the application
  So that I can access my account

  Background:
    Given I am on the login page

  Scenario: Successful login with valid credentials
    When I enter valid username and password
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see a welcome message
```

## Step Definitions

Step definitions are written in TypeScript and use Cypress commands.

### File Organization
- **common.steps.ts**: Shared steps used across multiple features
- **feature-specific.steps.ts**: Steps specific to a particular feature

### Best Practices
1. Use data-testid attributes for element selection
2. Keep steps reusable and parameterized
3. Use TypeScript for better type safety
4. Handle data tables properly
5. Include proper error handling

### Example
```typescript
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given("I am on the {string} page", (pageName: string) => {
  cy.visit(`/${pageName.toLowerCase()}`);
});

When("I type {string} into {string}", (text: string, fieldName: string) => {
  cy.get(`[data-testid="${fieldName}-input"]`).type(text);
});

Then("I should see {string}", (text: string) => {
  cy.contains(text).should("be.visible");
});
```

## Running Tests

### Run all feature files
```bash
npm run cypress:run
```

### Run specific feature file
```bash
npx cypress run --spec "cypress/e2e/features/login.feature"
```

### Open Cypress Test Runner
```bash
npm run cypress:open
```

## Configuration

The Cypress configuration in `cypress.config.ts` includes:
- Cucumber preprocessor setup
- Feature file pattern matching
- Reporter configuration (Mochawesome)

## Data Tables

Use data tables for complex data input:

```gherkin
Scenario: Create user with data table
  When I fill in the user details with:
    | Field    | Value           |
    | Username | newuser@test.com |
    | Name     | John Doe        |
    | Role     | User            |
```

```typescript
When("I fill in the user details with:", (dataTable: DataTable) => {
  const userData = dataTable.rowsHash();
  cy.get('[data-testid="username-field"]').type(userData.Username);
  cy.get('[data-testid="name-field"]').type(userData.Name);
  cy.get('[data-testid="role-select"]').select(userData.Role);
});
```

## Tags

Use tags to organize and filter scenarios:

```gherkin
@smoke @login
Scenario: Basic login functionality
  Given I am on the login page
  When I log in with valid credentials
  Then I should see the dashboard

@regression @user-management
Scenario: Create new user
  Given I am logged in as an administrator
  When I create a new user
  Then the user should be created successfully
```

Run tagged scenarios:
```bash
npx cypress run --env grepTags="@smoke"
```

## Troubleshooting

### Common Issues
1. **Step definitions not found**: Ensure step definition files are in the correct directory
2. **Feature files not running**: Check the spec pattern in cypress.config.ts
3. **TypeScript errors**: Verify tsconfig.json includes step definition files

### Debugging
- Use `cy.log()` for debugging step definitions
- Use `cy.pause()` to pause test execution
- Check Cypress logs for detailed error messages
