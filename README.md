# Task Manager

Aplicação de gerenciamento de tarefas construída com NestJS, TypeORM e PostgreSQL.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Docker](https://www.docker.com/get-started) (versão 20.10 ou superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versão 2.0 ou superior)
- [Node.js](https://nodejs.org/) (versão 22 ou superior) - apenas para desenvolvimento local
- [Yarn](https://yarnpkg.com/) - apenas para desenvolvimento local

## 🚀 Como rodar o projeto

### Opção 1: Usando Docker Compose (Recomendado)

Esta é a forma mais simples de executar o projeto:

1. **Clone o repositório** (se ainda não tiver feito):

   ```bash
   git clone https://github.com/samuhmatos/teste-task-manager.git
   cd task-manager
   ```

2. **Crie um arquivo `.env` na raiz do projeto** com as seguintes variáveis:

   ```env
   APP_PORT=3001
   DATABASE_HOST=localhost
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=123
   DATABASE_DATABASE=task
   DATABASE_PORT=5432
   DATABASE_LOGGING=false
   DATABASE_MIGRATIONS=dist/**/migrations/**/*.js
   ```

3. **Crie a rede Docker necessária**:

   ```bash
   docker network create task-network
   ```

4. **Construa e inicie os containers**:

   ```bash
   docker-compose up -d --build
   ```

5. **Execute as migrations**:

   ```bash
   docker-compose exec app yarn typeorm migration:run -d dist/database/data-source.js
   ```

6. **Acesse a aplicação**:
   - API: http://localhost:3001
   - Documentação swagger http://localhost:3001/docs
   - Banco de dados PostgreSQL: localhost:5432

### Opção 2: Desenvolvimento Local (sem Docker)

Se preferir rodar localmente sem Docker:

1. **Instale as dependências**:

   ```bash
   yarn install
   ```

2. **Configure um banco de dados PostgreSQL** local ou remoto e crie um arquivo `.env`:

   ```env
   APP_PORT=3001
   DATABASE_HOST=localhost
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=123
   DATABASE_DATABASE=task
   DATABASE_PORT=5432
   DATABASE_LOGGING=false
   DATABASE_MIGRATIONS=dist/**/migrations/**/*.js
   ```

3. **Compile o projeto**:

   ```bash
   yarn build
   ```

4. **Execute as migrations**:

   ```bash
   yarn migration:run
   ```

5. **Inicie a aplicação em modo desenvolvimento**:

   ```bash
   yarn start:dev
   ```

   Ou em modo produção:

   ```bash
   yarn start:prod
   ```

## 🔧 Comandos Disponíveis

### Desenvolvimento

```bash
# Instalar dependências
yarn install

# Executar em modo desenvolvimento (watch mode)
yarn start:dev

# Executar em modo debug
yarn start:debug

# Compilar o projeto
yarn build

# Executar em modo produção
yarn start:prod
```

### Testes

```bash
# Executar testes unitários
yarn test

# Executar testes em watch mode
yarn test:watch

# Executar testes com coverage
yarn test:cov

# Executar testes e2e
yarn test:e2e
```

### Migrations

```bash
# Executar migrations (local)
yarn migration:run

# Executar migrations (dentro do container)
docker-compose exec app yarn typeorm migration:run -d dist/database/data-source.js

# Reverter última migration
yarn migration:revert
# ou dentro do container:
docker-compose exec app yarn typeorm migration:revert -d dist/database/data-source.js

# Criar nova migration
yarn migration:create NomeDaMigration

# Gerar migration a partir das entidades
yarn migration:generate

# Dropar schema do banco
yarn migration:drop

# Recriar schema (drop + run)
yarn migration:recreate
```

### Qualidade de Código

```bash
# Executar linter
yarn lint

# Formatar código
yarn format
```

## 🐳 Comandos Docker Úteis

```bash
# Construir e iniciar os containers
docker-compose up -d --build

# Parar os containers
docker-compose down

# Parar e remover volumes (apaga dados do banco)
docker-compose down -v

# Ver logs da aplicação
docker-compose logs -f app

# Ver logs do banco de dados
docker-compose logs -f db

# Executar comando dentro do container da aplicação
docker-compose exec app <comando>

# Acessar shell do container da aplicação
docker-compose exec app sh

# Rebuildar apenas o container da aplicação
docker-compose up -d --build app
```

## 📁 Estrutura do Projeto

```
task-manager/
├── src/
│   ├── database/          # Configuração do banco de dados e migrations
│   ├── domain/            # Módulos de domínio (tasks, auth, etc)
│   ├── shared/            # Código compartilhado
│   ├── app.module.ts      # Módulo principal
│   └── main.ts            # Entry point da aplicação
├── test/                  # Testes e2e
├── scripts/               # Scripts auxiliares
├── docker-compose.yml     # Configuração Docker Compose
├── Dockerfile             # Imagem Docker da aplicação
└── package.json           # Dependências e scripts
```

## 🔍 Troubleshooting

### Problema: Container não inicia

- Verifique se a rede Docker `task-network` foi criada:
  ```bash
  docker network create task-network
  ```
- Verifique se as variáveis de ambiente estão configuradas corretamente no arquivo `.env`
- Verifique se as portas 3001 e 5432 não estão em uso:
  ```bash
  lsof -i :3001
  lsof -i :5432
  ```

### Problema: Migrations não executam

- Certifique-se de que o banco de dados está rodando e acessível
- Verifique se o caminho das migrations está correto no `.env`
- Execute manualmente dentro do container:
  ```bash
  docker-compose exec app yarn typeorm migration:run -d dist/database/data-source.js
  ```

### Problema: Erro de conexão com o banco

- Verifique se o container do banco está rodando: `docker-compose ps`
- Verifique os logs do banco: `docker-compose logs db`
- Certifique-se de que o `DATABASE_HOST` está correto (use `db` dentro do Docker Compose)

## 📝 Notas Importantes

- O comando de migration **dentro do container** deve ser executado com o caminho completo: `yarn typeorm migration:run -d dist/database/data-source.js`
- Os dados do banco PostgreSQL são persistidos no diretório `./data/db-data` (criado automaticamente)
- A aplicação usa timezone `America/Sao_Paulo` por padrão

## 📚 Tecnologias Utilizadas

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para TypeScript/JavaScript
- **PostgreSQL** - Banco de dados relacional
- **Docker** - Containerização
- **Yarn** - Gerenciador de pacotes

## 📄 Licença

Este projeto é privado e não possui licença pública.
