Feature: Reply
  As a usuário cadastrado do sistema
  I want to adicionar respostas e comentários às listas de discussões do fórum
  So that eu possa participar das listas de discussões respondendo a elas ou a cometários delas

# GUI Scenarios
Scenario: Responder à lista de discussão
  Given eu estou logado como usuário 
  And eu estou na página da lista de discussão "Qual é a derivada de 2x" criada pelo usuário "Carlos"
  And eu vejo a resposta do usuário João: "Não faço ideia"
  When eu envio a resposta "É 2" ao sistema
  Then eu continuo na página da discussão "Qual é a derivada de 2x" criada por "Carlos"
  And eu vejo a resposta do usuário "João": "Não faço ideia"
  And eu vejo logo abaixo da resposta de João a minha mensagem "É 2"

Scenario: Tentar responder lista com resposta em branco
  Given eu estou logado como usuário 
  And eu estou na página da lista de discussão "Qual é a derivada de 2x" criada pelo usuário "Carlos"
  And eu vejo a resposta do usuário "João": "Não faço ideia"
  When eu envio uma resposta vazia ao sistema
  Then eu continuo na página da discussão "Qual é a derivada de 2x" criada por "Carlos"
  And eu vejo a resposta do usuário "João": "Não faço ideia"
  And eu vejo uma mensagem de erro indicando que não podem ser enviadas mensagens vazias

Scenario: Tentar responder à lista trancada
  Given eu estou logado como usuário 
  And eu estou na página da lista de discussão "Qual é a derivada de 2x" criada pelo usuário "Carlos"
  And eu vejo a resposta do usuário "João": "Não faço ideia"
  And a lista de discussão está trancada
  When eu envio a resposta "É 2" ao sistema
  Then eu continuo na página da discussão "Qual é a derivada de 2x" criada por "Carlos"
  And eu vejo a resposta do usuário "João": "Não faço ideia"
  And eu vejo uma mensagem de erro indicando que a discussão está trancada e não aceita novas respostas

Scenario: Responder comentário da lista
  Given eu estou logado como usuário 
  And eu estou na página da lista de discussão "Qual é a derivada de 2x" criada pelo usuário "Carlos"
  And eu vejo a resposta do usuário "João": "Não faço ideia"
  When eu envio "É 2" como resposta ao comentário de João
  Then eu continuo na página da discussão "Qual é a derivada de 2x" criada por "Carlos"
  And eu vejo a resposta do usuário "João": "Não faço ideia"
  And eu vejo logo abaixo da resposta de João a minha resposta, composta por uma citação à mensagem de João e o conteúdo "É 2".

Scenario: Tentar responder lista sem estar logado
  Given eu não estou logado no fórum
  And eu estou na página da lista de discussão "Qual é a derivada de 2x" criada pelo usuário "Carlos"
  And eu vejo a resposta do usuário "João": "Não faço ideia"
  When eu tento enviar "É 2" como resposta à discussão
  Then eu continuo na página da discussão "Qual é a derivada de 2x" criada por "Carlos"
  And eu vejo a resposta do usuário "João": "Não faço ideia"
  And eu vejo uma mensagem de erro indicando que eu devo logar no fórum para responder à discussão

# Service scenarios
Scenario: Armazenar resposta à lista de discussão
  Given há uma lista de discussão "Qual é a derivada de 2x" criada pelo usuário "Carlos" armazenada no sistema
  And a discussão possui a resposta "Não faço ideia" do usuário João
  When eu envio "É 2" como resposta à discussão ao sistema
  Then há uma lista de discussão "Qual é a derivada de 2x" criada pelo usuário "Carlos" armazenada no sistema
  And a discussão possui a resposta "Não faço ideia" do usuário João
  And a discussão possui a minha resposta "É 2"

Scenario: Tentar armazenar resposta em branco à lista
  Given há uma lista de discussão "Qual é a derivada de 2x" criada pelo usuário "Carlos" armazenada no sistema
  And a discussão possui a resposta "Não faço ideia" do usuário João
  When eu envio uma resposta vazia como resposta à discussão ao sistema
  Then há uma lista de discussão "Qual é a derivada de 2x" criada pelo usuário "Carlos" armazenada no sistema
  And a discussão possui a resposta "Não faço ideia" do usuário João
  And o sistema envia uma mensagem de erro devido ao fato de uma mensagem vazia ter sido recebida

Scenario: Tentar armazenar resposta à lista trancada
  Given há uma lista de discussão "Qual é a derivada de 2x" criada pelo usuário "Carlos" armazenada no sistema
  And a discussão possui a resposta "Não faço ideia" do usuário "João"
  And a lista está trancada
  When eu envio a resposta "É 2" à discussão ao sistema
  Then a discussão possui a resposta "Não faço ideia" do usuário João
  And o sistema envia uma mensagem de erro indicando que a discussão está trancada e não recebe novas respostas
  And a lista continua trancada

Scenario: Tentar armazenar resposta sem estar logado
  Given eu não estou logado no fórum 
  And há uma lista de discussão "Qual é a derivada de 2x" criada pelo usuário "Carlos" armazenada no sistema
  And a discussão possui a resposta "Não faço ideia" do usuário "João"
  When eu envio a resposta "É 2" à discussão ao sistema
  Then a discussão possui a resposta "Não faço ideia" do usuário João
  And o sistema envia uma mensagem de erro indicando que eu devo logar no fórum para responder à discussão

Scenario: Armazenar resposta à comentário
  Given há uma lista de discussão "Qual é a derivada de 2x" criada pelo usuário "Carlos" armazenada no sistema
  And a discussão possui a resposta "Não faço ideia" do usuário "João"
  When eu envio ao sistema a resposta "É 2" ao comentário de "João"
  Then a discussão possui a resposta "Não faço ideia" do usuário "João"
  And a discussão possui a minha resposta "É 2" armazenada como uma resposta à resposta de "João"
