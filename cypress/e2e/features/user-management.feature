Feature: User Management
  As an administrator
  I want to manage user accounts
  So that I can control access to the system

  Background:
    Given I am logged in as an administrator
    And I am on the user management page

  Scenario: Create a new user account
    When I click the "Add New User" button
    And I fill in the user details with:
      | Field    | Value           |
      | Username | newuser@test.com |
      | Name     | John Doe        |
      | Role     | User            |
    And I click the "Save" button
    Then I should see a success message
    And the new user should appear in the user list

  Scenario: Edit an existing user
    When I select a user from the list
    And I click the "Edit" button
    And I update the user name to "Jane Smith"
    And I click the "Save" button
    Then I should see a success message
    And the user name should be updated in the list

  Scenario: Delete a user account
    When I select a user from the list
    And I click the "Delete" button
    And I confirm the deletion
    Then I should see a success message
    And the user should be removed from the list
