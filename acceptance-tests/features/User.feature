Feature: User account

  # ALL MENTIONED USERS ARE NON-ADMIN USERS EXCEPT WHEN OTHERWISE SPECIFIED

  Scenario: Successful creation of user account
    Given There is no registered user in the forum with username "Fred", be it admin or non-admin
    And   I am at the sign in page
    When  I try to create an account with username "Fred", email "IAmFred12345@gmail.com" and password "ThisIsNotAPassword"
    Then  The system acknowledges successful account creation

    When  I go to the log in page
    And   I input "IAmFred12345@gmail.com" for the email and "ThisIsNotAPassword" for the password
    Then  I am able to authenticate successfully
    And   I am at the forum's initial page