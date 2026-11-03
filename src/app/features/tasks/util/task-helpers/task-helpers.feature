Feature: Task helpers

  Scenario: Tasks are sorted by priority
    Given tasks with the priorities "low, high, medium"
    When I sort the tasks by priority
    Then the priorities are in the order "high, medium, low"

  Scenario: A completed task is never overdue
    Given a "completed" task due on "2020-01-01"
    Then the task is not overdue
