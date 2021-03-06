Feature: criar uma lista de discussão
    As a usuário
    I want to criar uma lista de discussão
    so that eu possa discutir um tema de meu interesse com outros usuários


    Scenario: criar lista de discussão
	    Given não há nenhuma lista de discussão chamada "Biscoitos do modo ARAM" no tópico "python"
	    Given eu estou na página "Criação de lista de discussão"
        When eu insiro o nome "Biscoitos do modo ARAM"
        When eu seleciono o tópico "python"
		When eu confirmo a criação da thread
        Then recebo uma confirmação de que a lista de discussão foi criada
        Then eu vejo que foi criada a lista de discussão de nome "Biscoitos do modo ARAM" no tópico "python"


    Scenario: criar lista de discussão com nome já existente
	    Given há uma lista de discussão chamada "Como castar spell" no tópico "c++"
	    Given eu estou na página "Criação de lista de discussão"
        When eu insiro o nome "Como castar spell"
        When eu seleciono o tópico "c++"
		When eu confirmo a criação da thread
        Then eu vejo que não foi criada a lista de discussão
        Then recebo um aviso de erro relacionado à duplicata de nome da lista de discussão


    Scenario: criar lista de discussão sem tópico
	    Given não há uma lista de discussão chamada "Poção de invisibilidade" no tópico "html"
	    Given eu estou na página "Criação de lista de discussão"
        When eu insiro o nome "Poção de invisibilidade"
        When eu não seleciono qualquer tópico
		When eu confirmo a criação da thread
        Then eu vejo que não foi criada a lista de discussão
        Then recebo um aviso de erro indicando à falta de tópico

    Scenario: criar lista de discussão que já existe
	    Given há uma lista de discussão de nome "Não consigo achar a próxima missão!" e tópico "html" no sistema
	    When eu envio outra lista com as mesmas especificações para o sistema
	    Then o sistema continua a possuir apenas uma lista de discussão de nome "Não consigo achar a próxima missão!" no tópico "html"
