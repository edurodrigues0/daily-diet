# Daily Diet API

Este é um projeto "Daily Diet" que foi desafio proposto pela Rocketseat foi desenvolvido com o uso do Node.js, Fastify e Knex. Este projeto permite gerenciar informações relacionadas à dieta diária, como refeições, alimentos e dados do usuário.

## Instalação

1. Certifique-se de ter o Node.js instalado em sua máquina.
2. Clone este repositório para o seu ambiente local.
3. Navegue até o diretório do projeto.
4. Execute o seguinte comando para instalar as dependências:

```Javascript
npm install
```

## Uso

1. Após a conclusão da instalação, execute o seguinte comando para iniciar o servidor de desenvolvimento:

```Javascript
npm run dev
```

2. Configure as variáveis de ambiente copiando o arquivo .env.example para .env e ajustando as configurações.

3. Crie o banco de dados e execute as migrações:

```Javascript
npm knex -- migrate:latest
```

O servidor estará em execução em http://localhost:3333.

## Recursos

O Daily Diet API utiliza os seguintes recursos:

- NodeJS
- Fastify
- Knex
- Zod