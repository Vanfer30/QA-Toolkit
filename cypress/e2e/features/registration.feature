Feature: User Registration
  As a new user
  I want to register for an account
  So that I can access the application

  Background:
    Given I am on the registration page

  @smoke
  Scenario: Successful registration with valid data
    When I fill in the registration form with:
      | Field           | Value              |
      | First Name      | John               |
      | Last Name       | Doe                |
      | Email           | john.doe@test.com  |
      | Password        | SecurePass123!     |
      | Confirm Password| SecurePass123!     |
    And I accept the terms and conditions
    And I click the "Register" button
    Then I should see a success message
    And I should be redirected to the login page

  @regression
  Scenario: Registration with existing email
    When I fill in the registration form with:
      | Field           | Value              |
      | First Name      | Jane               |
      | Last Name       | Smith              |
      | Email           | existing@test.com  |
      | Password        | SecurePass123!     |
      | Confirm Password| SecurePass123!     |
    And I accept the terms and conditions
    And I click the "Register" button
    Then I should see an error message
    And the error should indicate the email already exists

  @regression
  Scenario: Registration with password mismatch
    When I fill in the registration form with:
      | Field           | Value              |
      | First Name      | Bob                |
      | Last Name       | Wilson             |
      | Email           | bob@test.com       |
      | Password        | SecurePass123!     |
      | Confirm Password| DifferentPass456!  |
    And I accept the terms and conditions
    And I click the "Register" button
    Then I should see validation error messages
    And the error should indicate password mismatch
