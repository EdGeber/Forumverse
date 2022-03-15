Feature: Admin account
  As a      forum administrator
  I want to be able to delete and edit threads, questions and answers of non-admin users, as well as delete non-admin users
  So that   I can have full control over the forum and make sure that all questions and answers follow the forum's policies and guidelines

  # ALL MENTIONED USERS ARE NON-ADMIN USERS EXCEPT WHEN OTHERWISE SPECIFIED

  Scenario: Removal of an answer from an existing thread
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

  Scenario: Removal of an existing discussion thread
    Given I am logged as an admin
    And   I am at the page of the discussion with question "How to print in C#?", made by user Johnathan
    And   The only answer to the question is "Just check the docs…", made by Maryanne

    When  I select the option to delete the discussion
    And   I confirm my intention to delete
    Then  I am redirected to the start page of the forum
    And   I see a confirmation message of the deletion

    When  I search for a discussion with question "How to print in C#?"
    Then  A discussion with that name does not show up as a result

  Scenario: Editing of an answer from another user
    Given I am logged as an admin
    And   I am at the page of the discussion with question "Is it cold where you guys live?", made by user Joseph
    And   The first answer to the question is "No, I live in Recife", made by Anne
    And   The second and last answer to the question is "Yes, I live in South Carolina, Belleview Avenue, 123", made by Mathew

    When  I select the option to edit Mathews's answer
    And   I edit it to "Yes, I live in South Carolina"
    And   I confirm the edition
    Then  I'm still at the page of the discussion with question "Is it cold where you guys live?", made by user Joseph
    And   The first answer to the question is "No, I live in Recife", made by Anne
    And   The second and last answer to the question is "Yes, I live in South Carolina", made by Mathew
    And   Next to Mathew's anwer, I can see a message telling that the answer was edited by an admin

    When  I log in with a non-admin account
    And   I go to the page of the discussion with question "Is it cold where you guys live?", made by user Joseph
    Then  The first answer to the question is "No, I live in Recife", made by Anne
    And   The second and last answer to the question is "Yes, I live in South Carolina", made by Mathew
    And   Next to Mathew's anwer, I can see a message telling that the answer was edited by an admin

  Scenario: Exclusion of a non-admin user
    Given I am logged as an admin
    And   There is a user Julius in the forum whose registered email is "julius12345@gmail.com"
    And   I am at the page of the discussion with question "How to print in Ruby?", made by Julius
    And   The only answer to the question is "This guy is asking "How to print in" questions for every language! He is trolling", made by Madeline

    When  I select the option to exclude user Julius
    And   I confirm my intention to exclude
    Then  I am redirected to the start page
    And   I see a confirmation message of the deletion

    When  I search for a discussion with question "How to print in Ruby?"
    Then  A discussion with that name does not show up as a result

    When  I try to create a new user account using the email "julius12345@gmail.com"
    Then  The forum will not allow me to do so

  Scenario: Fail to edit another admin's answer
    Given I am logged as an admin
    And   I am at the page of the discussion with question "How to print in Python?", made by user Williams
    And   The only answer to the question is "Use the print function.", made by Kaori, an admin user
    When  I try to edit Kaori's answer
    Then  I can't edit because Kaori is an admin user
    And   The only answer to the question is still "Use the print function.", made by Kaori

  Scenario: Fail to create admin account with an existing username
    Given There is a registered user in the forum with username "Naomi", email "IamNaomi@gmail.com" and password "Jun'ichirou"
    And   I have asked the forum system to create a new admin account
    When  I provide "Naomi" as the username of the admin account I'm trying to create
    Then  The system won't let me create the admin account because the username "Naomi" is taken
    And   There is still a registered user in the forum with username "Naomi" and email "IamNaomi@gmail.com"
    And   There is no admin account with username "Naomi" registered in the forum

  Scenario: Fail to create admin account with an existing username of an admin
    Given There is a registered admin user in the forum with username "Kasa", email "IamKasa@gmail.com" and password "KasaMeansUmbrella"
    And   I have asked the forum system to create a new admin account
    When  I provide "Kasa" as the username of the admin account I'm trying to create
    Then  The system won't let me create the admin account because the username "Kasa" is taken
    And   There is still only one admin account with username "Kasa" in the forum, and its email is "IamKasa@gmail.com"

  Scenario: Successful creation of admin account
    Given There is no registered user in the forum with username "Sora", be it admin or non-admin
    When  I ask the forum system to create a new admin account with username "Sora", email "SoraAmI@gmail.com" and password "SoraMeansSky"
    Then  The system acknowledges successful admin account creation

    When  I go to the forum's authentication page
    And   I input "Sora" for the username, "SoraAmI@gmail.com" for the email and "SoraMeansSky" for the password
    Then  I am able to authenticate successfully
    And   I am at the forum's initial page
    And   I can see my account is an admin account

  Scenario: 'Admin' flag on admin answer
    Given There is an admin user Junia in the forum with email "JuniaWhoAreYa@gmail.com" and password "IamALiar"
    And   I am logged as the admin user Junia
    And   I am at the page of the discussion with question "How to print in C?", made by user Johnathan
    And   The only answer to the question is "I don't know, let's see what an admin says", made by user Joice

    When  I answer "I don't know, let's see what a non-admin says"
    Then  I can see my answer "I don't know, let's see what a non-admin says" below Joice's answer
    And   I can see a label along with my answer telling I am an admin

    When  I log in with a non-admin account
    And   I go to the page of the discussion with question "How to print in C?", made by user Johnathan
    Then  The first answer to the question is "I don't know, let's see what an admin says", made by user Joice
    And   The second and last answer is "I don't know, let's see what a non-admin says", made by Junia
    And   I can see a label along with Junia's answer telling Junia is an admin
