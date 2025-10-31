#!/bin/bash

# Verifica se o nome foi fornecido
if [ -z "$1" ]; then
  echo "❌ Nome da migration não informado."
  echo "Uso: ./typeorm-create.sh nome_da_migration"
  exit 1
fi

# Define o caminho base
MIGRATION_NAME=$1
MIGRATION_PATH="./src/database/migrations/$MIGRATION_NAME"

# Executa o comando yarn
echo "📦 Gerando migration com nome: $MIGRATION_NAME"
yarn typeorm migration:create "$MIGRATION_PATH"
