Feature: Task board

  Scenario: Seeded tasks are shown
    Given I open the task board
    Then I see the task "Set up CI pipeline"

  Scenario: Create a task
    Given I open the task board
    When I create a task titled "Write E2E tests"
    Then I see the task "Write E2E tests"
