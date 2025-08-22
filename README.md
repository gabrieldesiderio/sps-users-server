
# SPS Users API

API com autenticação JWT e CRUD de usuários.

Utilizei uma Clean Architecture simples, com SOLID e DDD. Conforme solicitado no teste, apliquei o conceito de repositório em memória para simular um banco de dados fake. 


## Stack utilizada

Node, Fastify, Swagger, Zod


## Rodando localmente

Clone o projeto

```bash
  git clone git@github.com:gabrieldesiderio/sps-users-server.git
```

Entre no diretório do projeto

```bash
  cd sps-users-server
```

Instale as dependências

```bash
  npm install
```

Inicie o servidor

```bash
  npm run dev
```

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu `.env`

`PORT`
`JWT_SECRET`
`FRONT_END_URL`

Existe um arquivo `.env.example` que você pode fazer uma cópia e renomear para `.env`.

## Autor

- [@gabrieldesiderio](https://www.github.com/gabrieldesiderio)

