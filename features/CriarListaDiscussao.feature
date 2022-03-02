Feature: criar uma lista de discussão
    As a usuário
    I want to criar uma lista de discussão
    so that eu possa discutir um tema de meu interesse com outros usuários


    Scenario: criar lista de discussão
	    Given não há nenhuma lista de discussão chamada “Biscoitos do modo
            ARAM” no tópico “League of Legends”
	    And eu estou na página “Criação de lista de discussão”
        When eu insiro o nome “Biscoitos do modo ARAM”
        And eu seleciono o tópico “League of Legends”
        Then  recebo uma confirmação de que a lista de discussão foi criada
        And eu vejo que foi criada a lista de discussão de nome “Biscoitos do
            modo ARAM” no tópico “League of Legends”


    Scenario: criar lista de discussão com nome já existente
	    Given há uma lista de discussão chamada “Como castar spell” no
            tópico “Tibia”
	    And eu estou na página “Criação de lista de discussão”
        When eu insiro o nome “Como castar spell”
        And eu seleciono o tópico “Tibia”
        Then eu vejo que não foi criada a lista de discussão
        And recebo um aviso de erro relacionado à duplicata de nome da
            lista de discussão


    Scenario: criar lista de discussão sem tópico
	    Given não há uma lista de discussão chamada “Poção de invisibilidade”
            no tópico “Minecraft”
	    And eu estou na página “Criação de lista de discussão”
        When eu insiro o nome “Poção de invisibilidade”
        And eu não seleciono qualquer tópico
        Then eu vejo que não foi criada a lista de discussão
        And recebo um aviso de erro indicando à falta de tópico

    ###~Service scenarios
    Scenario: criar lista de discussão que já existe
	    Given há uma lista de discussão de nome “Não consigo achar a
            próxima missão!” e tópico “Grand Chase” no sistema
	    When eu envio outra lista com as mesmas especificações para o sistema
	    Then o sistema continua a possuir apenas uma lista de discussão de
            nome “Não consigo achar a próxima missão!” no tópico “Grand Chase”
<<<<<<< HEAD
    <<<<<<< HEAD
        And ---- passo pedido na questão 7-e)-I ------
    =======

    Scenario: pedido na questão 7-d)
    >>>>>>> desenvolvimento

    Scenario: pedido na questão 7-f)
        Given ---- mudança pedida na questão 8 ----

    Mudança master questão 14-a)
=======

    Scenario: pedido na questão 7-d)

    Scenario: pedido na questão 7-f)

    Mudança 1 desenvolvimento questão 14-a)
<<<<<<< HEAD
>>>>>>> Commit desenvolvimento 1 da questão 14-a)
=======

    Mudança 2 desenvolvimento questão 14-a)
>>>>>>> Commit desenvolvimento 2 da questão 14-a)
    
    Scenario: pedido na questão 15.
        Given: ajuste pedido na questão 15.
