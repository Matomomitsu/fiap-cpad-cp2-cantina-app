# Task Plan - CP1 Cantina FIAP

## Status Geral

- [x] Ler as instrucoes da CP1 no material consolidado
- [x] Definir o problema escolhido: filas na cantina da FIAP
- [x] Definir a proposta do MVP: app de cantina com pedido e retirada
- [x] Criar o app Expo no repositorio
- [ ] Implementar o fluxo completo de telas
- [ ] Finalizar README e materiais de entrega

## Contexto do Projeto

Este projeto atende ao Checkpoint 1 de Cross-Platform Application Development.

O grupo escolheu resolver o problema das filas da cantina da FIAP. Como os alunos possuem um intervalo curto, a proposta e criar um app simples que permita visualizar produtos, montar pedido, simular pagamento e gerar uma senha de retirada.

## Resultado Esperado do MVP

Fluxo principal que deve funcionar do inicio ao fim:

- login do aluno
- visualizacao do cardapio
- selecao de produtos
- tela de pagamento
- tela final com numero do pedido e informacoes de retirada

## Requisitos da CP1 que Precisam Ser Respeitados

- [x] Projeto em React Native + Expo
- [x] Estrutura organizada
- [x] Uso de `View`, `Text`, `Image` e `TouchableOpacity`
- [x] Componentizacao real
- [x] Uso de `useState` e/ou `useEffect`
- [x] Estilizacao com `StyleSheet`
- [x] Pelo menos 3 telas com Expo Router
- [x] Navegacao funcional entre todas as telas
- [x] Projeto rodando com `npx expo start`
- [ ] README completo
- [ ] Todos os integrantes com commits relevantes

## Tarefas por Agente e Participante

### Participante 1 - Base do Projeto e Navegacao
Usuario responsavel: `Mateus Tomomitsu`

Objetivo:
Preparar toda a espinha dorsal do app para que os outros agentes implementem funcionalidades sem retrabalho.

Tarefas:

- [x] Criar o projeto com Expo
- [x] Garantir que a aplicacao rode com `npx expo start`
- [x] Definir estrutura inicial de pastas, por exemplo: `app`, `components`, `data`, `assets`, `styles`
- [x] Configurar Expo Router corretamente
- [x] Criar as rotas base para `login`, `cardapio`, `pagamento` e `pedido-final`
- [x] Criar um layout base para as telas
- [x] Implementar navegacao entre as telas com botoes funcionais
- [x] Garantir que nenhuma tela fique morta ou inacessivel
- [x] Criar componentes base reaproveitaveis, como botao principal e container de tela
- [x] Deixar comentarios ou nomes de arquivos claros para facilitar o trabalho dos outros agentes

Definicao de pronto:

- [x] App abre sem erro
- [x] Todas as rotas existem
- [x] Navegacao base esta funcional

### Participante 2 - Login e Dados do Usuario
Usuario responsavel: `Henrique Mandrick`

Objetivo:
Implementar a entrada do usuario no fluxo do app de forma simples e mockada.

Tarefas:

- [x] Criar a tela de login com identidade visual coerente
- [x] Adicionar campos mockados como nome e RM ou identificador do aluno
- [x] Validar se os campos obrigatorios foram preenchidos
- [x] Exibir mensagem de erro quando houver campos vazios
- [x] Exibir feedback visual ao prosseguir com sucesso
- [x] Salvar os dados do usuario em estado local
- [x] Encaminhar o usuario para a tela de cardapio apos login valido
- [x] Garantir que a tela funcione em telas menores sem quebrar layout
- [x] Integrar o login ao fluxo criado pelo Participante 1

Definicao de pronto:

- [x] Usuario consegue preencher os dados
- [x] Validacao minima funciona
- [x] Navegacao para o cardapio funciona

### Participante 3 - Cardapio, Produtos e Carrinho
Usuario responsavel: `Participante 3`

Objetivo:
Implementar a principal tela do MVP, permitindo que o usuario veja os itens da cantina e monte seu pedido.

Tarefas:

- [ ] Criar um arquivo de dados mockados com os produtos da cantina
- [ ] Definir para cada produto: nome, preco, categoria, imagem ou placeholder e disponibilidade
- [ ] Criar componente de card de produto
- [ ] Exibir lista de produtos na tela de cardapio
- [ ] Permitir adicionar item ao pedido
- [ ] Permitir remover item ou diminuir quantidade
- [ ] Exibir quantidade selecionada por item
- [ ] Exibir subtotal ou total parcial do pedido
- [ ] Tratar estado vazio quando nenhum item tiver sido selecionado
- [ ] Tratar estado visual quando um produto estiver indisponivel
- [ ] Preparar os dados do pedido para serem consumidos na tela de pagamento

Definicao de pronto:

- [ ] Cardapio renderiza corretamente
- [ ] Usuario consegue montar um pedido simples
- [ ] Total parcial e atualizado em tempo real

### Participante 4 - Pagamento e Pedido Final
Usuario responsavel: `Participante 4`

Objetivo:
Concluir o fluxo do pedido com uma simulacao clara de pagamento e geracao da senha de retirada.

Tarefas:

- [ ] Criar a tela de pagamento
- [ ] Receber e exibir resumo dos itens escolhidos
- [ ] Exibir quantidade total de itens e valor final
- [ ] Criar opcoes mockadas de pagamento, por exemplo: pix, cartao e saldo
- [ ] Permitir selecionar apenas uma forma de pagamento por vez
- [ ] Validar se o usuario escolheu uma forma de pagamento antes de continuar
- [ ] Criar feedback visual de processamento do pagamento
- [ ] Simular a confirmacao do pedido
- [ ] Gerar um numero ou senha local para retirada
- [ ] Criar a tela final com numero do pedido, itens, valor total e mensagem de retirada
- [ ] Garantir navegacao consistente da tela de pagamento para a tela final

Definicao de pronto:

- [ ] Pagamento mockado funciona
- [ ] Pedido final e exibido com senha
- [ ] Fluxo termina de forma clara para demonstracao

### Participante 5 - UI, Qualidade, README e Entrega
Usuario responsavel: `Participante 5`

Objetivo:
Elevar a qualidade final do projeto para atender bem aos criterios de avaliacao da CP1.

Tarefas:

- [ ] Revisar consistencia visual de todas as telas
- [ ] Ajustar cores, espacamentos, tipografia e contraste
- [ ] Garantir identidade visual alinhada com a proposta da FIAP
- [ ] Verificar responsividade minima com Flexbox ou `Dimensions`
- [ ] Adicionar estados visuais extras, como carregamento, sucesso e vazio, onde fizer sentido
- [ ] Revisar textos da interface para manter consistencia
- [ ] Organizar capturas de tela de cada tela do app
- [ ] Produzir ou coordenar GIF/video demonstrando o fluxo principal
- [ ] Criar ou completar o `README.md`
- [ ] Documentar: sobre o projeto, integrantes, como rodar, prints, demonstracao e decisoes tecnicas
- [ ] Fazer checklist final de entrega com base na CP1

Definicao de pronto:

- [ ] UI final esta consistente
- [ ] README esta completo
- [ ] Materiais de demonstracao estao preparados

## Dependencias Entre Participantes

- [x] Particpante 1 deve concluir a base antes de bloquear o restante do time
- [x] Particpante 2 depende da navegacao inicial criada pelo Particpante 1
- [ ] Particpante 3 depende da estrutura de tela e rotas criadas pelo Particpante 1
- [ ] Particpante 4 depende dos dados de pedido organizados pelo Particpante 3
- [ ] Particpante 5 depende de telas minimamente prontas dos Particpantes 1, 2, 3 e 4

## Constraints Para Participantes Futuros

Estas regras devem ser respeitadas por qualquer participante que continuar o trabalho neste repositorio:

- [ ] Nao sair do escopo do conteudo visto ate a Aula 05 sem justificativa
- [ ] Nao integrar API REST, banco de dados real ou autenticacao real neste checkpoint
- [ ] Nao depender de backend para o fluxo principal do MVP
- [ ] Priorizar dados mockados locais
- [ ] Usar Expo Router para a navegacao
- [ ] Usar componentes core do React Native
- [ ] Manter o uso de `StyleSheet`
- [ ] Evitar bibliotecas pesadas de UI
- [ ] Evitar colocar toda a aplicacao em um unico arquivo
- [ ] Preservar o fluxo principal: login -> cardapio -> pagamento -> pedido final
- [ ] Garantir compatibilidade com `npx expo start`
- [ ] Fazer commits descritivos e separaveis por participante
- [ ] Manter o projeto simples, demonstravel e coerente com a proposta da cantina

## Checklist Final de Entrega

- [ ] App abre sem erros
- [ ] Fluxo principal completo esta funcionando
- [ ] Existem pelo menos 4 telas no projeto
- [ ] Navegacao entre telas esta funcional
- [ ] Componentes estao separados de forma organizada
- [ ] Estados com `useState` e/ou `useEffect` foram usados de forma adequada
- [ ] Estilizacao esta consistente
- [ ] README esta completo
- [ ] Prints de todas as telas foram capturados
- [ ] GIF ou video foi produzido
- [ ] Todos os integrantes possuem commits relevantes
- [ ] Repositorio segue o padrao esperado pela CP1

## Observacao

- [x] O arquivo foi estruturado com tarefas abertas e concluida(s)
- [ ] Substituir `Participante 1` a `Participante 5` pelos nomes reais do grupo assim que definidos
