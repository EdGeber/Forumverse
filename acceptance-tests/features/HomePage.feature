 Feature: Página inicial
    As a User
    I want to be able to see the posts titles in a specific order, expand these posts and search for topics/posts on the  "main" page.
    So that I can have a smoother experience while using the "Forum".

	Scenario: Filter threads by name
		Given I am at the "Home" page.
		Given I see a discussion with title "How to print in Python" and topic "python"
		Given I see a discussion with title "How to create concurrent programs in C++" and topic "c++"
		Given I see a discussion with title "Why isn't HTML a programming language?" and topic "html"
		When  I filter the threads by name "How to"
		Then  I see a discussion with title "How to print in Python"
		Then  I see a discussion with title "How to create concurrent programs in C++"
		Then  I don't see any discussion with title "Why isn't HTML a programming language?"

 	Scenario: GUI - Filtrar posts no menu inicial por múltiplos tópicos.
 		Given I am at the "Home" page.
 		Given I can see the "Topic filter". 
 		Given There are no selected topics in the "Topic filter".
 		When I request to filter by the topics: "Futebol", "Anime".
 		Then I can now see only the threads related to the topics: "Futebol" or "Anime"
 		Then I'm still at the "Home" page.

 	Scenario: GUI - despor posts do menu inicial por ordem "Mais recente"
 		Given I am at the "Home" page.
 		Given I can see the first post title is "Putin invadiu a Ucrânia." with time of post "2 days ago"
 		Given I can see the second post title "Aviões militares chineses no espaço aéreo de Taiwan" with time of post "1 day ago".
 		Given I can see the third post title "USA e a NATO executam sanções a Russia" with time of post "12 hours ago"
 		When I request to sort the posts by "Most Recent"
 		Then I can see that the first post is "USA e a OTAN executam sanções a Russia"
 		Then I can see that the second post is "Aviões militares chineses no espaço aéreo de Taiwan" 
 		Then I can see that the third post is "Putin invadiu a Ucrânia."
 		Then I'm still at the "Home" page.

 	Scenario: GUI - Expandir um post que foi deletado.
 		Given I am at the "Home" page.
 		Given I can see the post title "A NA'VI se tornará um time russo?".
 		When I select this post title.
 		Then I can see a warning explaining that this post does not exist.. 
 		Then I am at the "Home" page.

 	Scenario: GUI - Usuário não cadastrado: Tentar visualizar os próprios posts
 		Given I am at the "Home" page.
 		Given I am not logged in.
 		Given I can all the post from all users sorted by "Mais Recente"    
 		When I select to filter by "Only my posts".
 		Then I'm still at the "Home" Page
 		Then I can see a warning that only logged users can see their posts.
 		Then I still can see all the post from all users sorted by "Mais Recente"
 		Then I am redirected to "login" page.

 	Scenario: GUI - Usuário cadastrado: Tentar visualizar os próprios posts
 		Given I am at the "Home" page.
 		Given I am logged in as "user00".
 		Given I can all the post from all users sorted by "Mais Recente"    
 		When I select to filter by "Only my posts".
 		Then I'm still at the "Home" Page
 		Then I can see all the posts made by "user00"

 	Scenario: GUI - Expandir um post.
 		Given I am at the "Home" page.
 		Given I can see the post title "A NA'VI se tornará um time russo?".
 		When I select this post title.
 		Then I'm redirected to "A NA'VI se tornará um time Russo?" page. 
 		Then I can now see the whole post, its information("topics", "creator", "date/hour"), its commentaries.