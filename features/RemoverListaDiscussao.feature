Feature: remover lista de discussão
    As a usuário
    I want to excluir minha(s) lista(s) de discussão(ões)
    so that eu possa garantir que ela(s) não exista(m) mais no sistema

Scenario: remover uma lista de discussão
		Given há uma lista de discussão chamada “Pior mapa do jogo” no
            tópico “Battlefield 1”
	And eu estou na página “Remoção de lista de discussão”
    When eu seleciono a lista de discussão “Pior mapa do jogo”
    Then eu recebo uma confirmação de remoção
    And eu vejo que a lista de discussão de nome “Pior mapa do jogo” 
        não mais está presente no tópico “Battlefield 1”

###~Service scenarios
Scenario: remover lista de discussão que não existe
	Given não há uma lista de discussão de nome “Limpei o radiador do meu
        carro” no tópico “Automóveis” no sistema
	When eu envio a solicitação para a exclusão da lista de discussão para o
        sistema
    Then o sistema continua a não possuir a lista de discussão de nome “Limpei
        o radiador do meu carro” no tópico “Automóveis” no sistema

