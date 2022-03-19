Feature: Remove reply

  Scenario: User successful remove it answer from an existing thread
    Given I am loggead as a regular user
    And   I am at the page "How to calculate the area of a triangle?", made by the user John
    And   I can see my answer: "b*h/2"
    And   I can see Paul's answer: "base times height, all this divided by 2"
    When  I select the option to delete my answer
    And   I confirm my intention to delete
    Then  I still at the page of the thread  "How to calculate a triangle area?"
    And   In the place of my answer, I can see a message telling that I deleted my answer
    And   I can see Paul's answer: "base times height, all this divided by 2"

  Scenario: Removal of an answer from an existing thread as admin user
    Given I am logged as an admin
    And   I am at the page of the discussion with question "How to print in JavaScript?", made by user John
    And   The only answer to the question is "I don't know", made by Mary

    When  I select the option to delete Mary's answer
    And   I confirm my intention to delete
    Then  I'm still at the page of the discussion with question "How to print in JavaScript?", made by user John
    And   I see a confirmation message of the deletion
    And   In the place of Mary's former answer, I see a message telling that the answer was deleted by an admin

    When  I log in with a non-admin account
    And   I go to the page of the discussion with question "How to print in JavaScript?", made by user John
    Then  In the place of an answer by Mary, I see a message telling that Mary's answer was deleted by an admin

  Scenario: Fail to delete another admin's answer as admin user
    Given I am logged as an admin
    And   I am at the page of the discussion with question "How to print in Python?", made by user Williams
    And   The only answer to the question is "Use the print function.", made by Kaori, an admin user
    When  I try to delete Kaori's answer
    Then  I can't delete because Kaori is an admin user
    And   The only answer to the question is still "Use the print function.", made by Kaori

    Scenario: Removal of commented answer
    Given I am loggead as a regular user
    And   I am at the page "What is your favorite programming language?", made by the user John
    And   I can see my answer: "HTML"
    And   I can see Paul's answer to my message: "HTML is not a programming language"
    When  I select the option to delete my answer
    And   I confirm my intention to delete
    Then  I still at the page of the thread  "What is your favorite programming language?"
    And   In the place of my answer, I can see a message telling that I deleted my answer
    And   I still can see Paul's answer to my deleted answer 