#!/bin/bash

echo "🔧 Iniciando o script de geração de migration do TypeORM..."

# Verifica se o nome foi fornecido
if [ -z "$1" ]; then
  echo "❌ Nome da migration não informado."
  echo "Uso: ./typeorm-generate.sh nome_da_migration"
  exit 1
fi

# Define o caminho base
MIGRATION_NAME=$1
MIGRATION_PATH="./src/database/migrations/$MIGRATION_NAME"
DATA_SOURCE="./dist/database/data-source.js"

# Executa o comando yarn
echo "📦 Gerando migration com nome: $MIGRATION_NAME"
yarn typeorm migration:generate "$MIGRATION_PATH" -d "$DATA_SOURCE"
