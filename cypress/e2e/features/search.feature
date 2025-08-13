Feature: Search Functionality
  As a user
  I want to search for content
  So that I can find relevant information quickly

  Background:
    Given I am on the search page

  Scenario Outline: Search with different terms
    When I search for "<search_term>"
    Then I should see "<expected_results>" results
    And the results should contain "<search_term>"

    Examples:
      | search_term | expected_results |
      | test        | 5                |
      | user        | 3                |
      | admin       | 2                |
      | invalid     | 0                |

  @smoke
  Scenario: Basic search functionality
    When I type "test" into search
    And I click the search button
    Then I should see search results
    And the results should be relevant to "test"

  @regression
  Scenario: Search with special characters
    When I type "test@example.com" into search
    And I click the search button
    Then I should see search results
    And the results should handle special characters properly

  @regression
  Scenario: Empty search
    When I click the search button without entering any term
    Then I should see a message asking me to enter a search term

  @regression
  Scenario: Search with very long term
    When I type a very long search term into search
    And I click the search button
    Then I should see search results
    And the search should handle long terms properly
