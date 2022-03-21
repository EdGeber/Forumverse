Feature: trancar lista de discussão
    As a usuário
    I want to trancar minha(s) lista(s) de discussão(ões)
    so that eu possa garantir que ela(s) não receba(m) mais respostas

    Scenario: trancar lista de discussão cuja resposta já foi aceita
		Given há uma lista de discussão chamada “Baunilha ou creme?” no
            tópico “Sorvetes”
	    And a resposta aceita já foi escrita na lista
        When eu seleciono a opção que realiza o trancamento da lista de   
            discussão
        Then eu recebo uma confirmação do trancamento da lista de discussão
        And eu vejo que a lista de discussão de nome “Baunilha ou creme?” no
            tópico “Sorvetes” não é mais capaz de receber respostas
    
    As a admin
    I want to trancar lista(s) de discussão(ões) de usuários do fórum
    so that eu possa garantir que ela(s) não receba(m) mais respostas

    Scenario: trancar lista de discussão antiga
		Given há uma lista de discussão chamada “Skate no quintal” no
            tópico “Esportes Radicais”
	    And a última resposta da lista foi feita à 10 anos
        When eu seleciono a opção que realiza o trancamento da lista de   
            discussão
        Then eu recebo uma confirmação do trancamento da lista de discussão
        And eu vejo que a lista de discussão de nome “Baunilha ou creme?” no
            tópico “Sorvetes” não é mais capaz de receber respostas

    ###~Service scenarios
    Scenario: trancar lista de discussão cuja resposta já foi aceita
	    Given há uma lista de discussão chamada “Baunilha ou creme?” de tópico
            “Sorvetes” no sistema
	    When eu envio a solicitação para o trancamento da lista de discussão para o
            sistema
        Then a lista de discussão chamada “Baunilha ou creme?” de tópico “Sorvetes” 
            está trancada
        And o sistema continua a possuir a não possuir a lista de discussão chamada
            “Baunilha ou creme?” de tópico “Sorvetes”

