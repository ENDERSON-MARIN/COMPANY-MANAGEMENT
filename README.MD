# 🏢 Sistema de Gestão de Empresas

API REST para consulta e gestão simplificada de empresas, desenvolvida com Node.js, TypeScript, Express, PostgreSQL e Prisma ORM, seguindo os princípios da Arquitetura Hexagonal.

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.1-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17-2D3748.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)

---

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Execução](#-execução)
- [Testes](#-testes)
- [Endpoints](#-endpoints)
- [Documentação Swagger](#-documentação-swagger)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Decisões Técnicas](#-decisões-técnicas)
- [Scripts Disponíveis](#-scripts-disponíveis)

---

## 🚀 Tecnologias

### Backend
- **Node.js** v22+ - Runtime JavaScript
- **TypeScript** v5.8 - Superset JavaScript com tipagem estática
- **Express** v5.1 - Framework web minimalista
- **Zod** v4.1 - Validação de schemas com inferência de tipos

### Banco de Dados
- **PostgreSQL** v16 - Banco de dados relacional
- **Prisma ORM** v6.17 - ORM moderno com type-safety

### Testes
- **Vitest** v3.2.4 - Framework de testes unitários e integração
- **Supertest** v7.1.4 - Testes HTTP end-to-end

### Documentação
- **Swagger UI Express** v5.0.1 - Interface interativa de documentação OpenAPI 3.0

### DevOps
- **Docker** & **Docker Compose** - Containerização
- **ESLint** & **Prettier** - Qualidade e formatação de código
- **Husky** - Git hooks para qualidade

---

## 🏗️ Arquitetura

O projeto segue os princípios da **Arquitetura Hexagonal (Ports & Adapters)**, com separação clara em 3 camadas:

```
src/
├── core/                # Núcleo da aplicação (Domain + Application)
│   ├── entities/        # Entidades de domínio puras
│   ├── ports/           # Interfaces/contratos (IRepository)
│   ├── services/        # Lógica de negócio (use cases)
│   └── errors/          # Erros customizados
│
├── adapters/            # Adaptadores externos
│   ├── controllers/     # HTTP handlers
│   ├── repositories/    # Implementação Prisma
│   ├── database/        # Configuração Prisma
│   ├── validators/      # Schemas Zod
│   ├── routes/          # Definição de rotas
│   └── middlewares/     # Middlewares Express
│
├── config/              # Configurações
│   └── swagger.ts       # Documentação OpenAPI
│
└── server.ts            # Ponto de entrada
```

**Benefícios:**
- ✅ Separação clara de responsabilidades
- ✅ Independência de frameworks externos
- ✅ Facilita testes unitários e de integração
- ✅ Código limpo e manutenível
- ✅ Escalável para novos módulos

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 22.x ou superior ([Download](https://nodejs.org/))
- **pnpm** 10.x ou superior ([Instalação](https://pnpm.io/installation))
- **PostgreSQL** 16.x ou superior ([Download](https://www.postgresql.org/download/))
- **Docker** (opcional, mas recomendado) ([Download](https://www.docker.com/))

---

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/ENDERSON-MARIN/COMPANY-MANAGEMENT
cd company-management-api
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/company_db?schema=public"
PORT=3000
NODE_ENV=development
```

### 4. Configure o banco de dados

#### Opção A: Com Docker (Recomendado)

```bash
# Subir banco PostgreSQL
docker-compose up -d postgres

# Aguardar banco inicializar (~10 segundos)
sleep 10

# Gerar cliente Prisma
pnpm prisma:generate

# Executar migrações
pnpm prisma:migrate
```

#### Opção B: PostgreSQL local

```bash
# Criar banco de dados
createdb company_db

# Gerar cliente Prisma
pnpm prisma:generate

# Executar migrações
pnpm prisma:migrate
```

---

## 🚀 Execução

### Desenvolvimento

```bash
# Iniciar em modo watch (recarrega automaticamente)
pnpm dev
```

A API estará disponível em: **http://localhost:3000**

### Produção

```bash
# Compilar TypeScript
pnpm build

# Iniciar servidor
pnpm start
```

### Docker (Aplicação Completa)

```bash
# Subir todos os serviços (PostgreSQL + API)
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Parar serviços
docker-compose down

# Remover volumes (limpar dados)
docker-compose down -v
```

---

## 🧪 Testes

O projeto possui cobertura completa de testes:

### Executar todos os testes

```bash
pnpm test
```

### Executar com cobertura

```bash
pnpm test:coverage
```

**Cobertura esperada:** > 90% em todas as métricas

### Testes específicos

```bash
# Apenas testes unitários
pnpm test tests/unit

# Apenas testes de integração
pnpm test tests/integration

# Apenas testes E2E
pnpm test tests/e2e

# Teste específico
pnpm test tests/unit/core/entities/Company.spec.ts

# Modo watch
pnpm test --watch
```

### Configurar banco de teste

```bash
# Criar banco de testes
createdb company_db_test

# Executar migrações
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/company_db_test?schema=public" pnpm prisma:migrate
```

### Tipos de testes implementados

| Tipo | Quantidade | Descrição |
|------|-----------|-----------|
| **Unitários** | ~50 | Entidades, Services, Validators, Errors |
| **Integração** | ~15 | Repositórios com banco real |
| **E2E** | ~30 | API completa com Supertest |
| **Total** | ~95 | Cobertura > 90% |

---

## 📡 Endpoints

### Base URL
```
http://localhost:3000/api
```

---

### 1. **POST** `/api/companies`
Cria uma nova empresa no sistema.

**Request Body:**
```json
{
  "name": "Tech Solutions LTDA",
  "cnpj": "12345678901234",
  "email": "contato@techsolutions.com",
  "phone": "47999999999",
  "address": "Rua das Flores, 123",
}
```

**Campos obrigatórios:** `name`, `cnpj`, `email`

**Validações:**
- `name`: 3-255 caracteres
- `cnpj`: 14 dígitos numéricos (sem formatação)
- `email`: formato de email válido
- `phone`: 10-11 dígitos (opcional)

**Respostas:**
- `201 Created`: Empresa criada com sucesso
- `400 Bad Request`: Dados inválidos
- `409 Conflict`: CNPJ já cadastrado

**Exemplo de resposta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Tech Solutions LTDA",
  "cnpj": "12345678901234",
  "email": "contato@techsolutions.com",
  "phone": "47999999999",
  "address": "Rua das Flores, 123",
  "createdAt": "2025-10-22T10:30:00.000Z",
  "updatedAt": "2025-10-22T10:30:00.000Z"
}
```

---

### 2. **GET** `/api/companies`
Retorna a lista de todas as empresas cadastradas, ordenadas por data de criação (mais recentes primeiro).

**Respostas:**
- `200 OK`: Lista de empresas retornada com sucesso

**Exemplo de resposta:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Tech Solutions LTDA",
    "cnpj": "12345678901234",
    "email": "contato@techsolutions.com",
    "createdAt": "2025-10-22T10:30:00.000Z",
    "updatedAt": "2025-10-22T10:30:00.000Z"
  },
  {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "name": "Inovação Digital SA",
    "cnpj": "98765432109876",
    "email": "contato@inovacao.com",
    "createdAt": "2025-10-21T15:20:00.000Z",
    "updatedAt": "2025-10-21T15:20:00.000Z"
  }
]
```

---

### 3. **GET** `/api/companies/{id}`
Retorna os dados de uma empresa específica pelo seu ID.

**Parâmetros:**
- `id` (UUID): Identificador único da empresa

**Respostas:**
- `200 OK`: Empresa encontrada
- `400 Bad Request`: ID inválido (não é UUID)
- `404 Not Found`: Empresa não encontrada

**Exemplo de resposta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Tech Solutions LTDA",
  "cnpj": "12345678901234",
  "email": "contato@techsolutions.com",
  "phone": "47999999999",
  "address": "Rua das Flores, 123",
  "createdAt": "2025-10-22T10:30:00.000Z",
  "updatedAt": "2025-10-22T10:30:00.000Z"
}
```

---

### 4. **PUT** `/api/companies/{id}`
Atualiza os dados de uma empresa existente. Todos os campos são opcionais.

**Parâmetros:**
- `id` (UUID): Identificador único da empresa

**Request Body (campos opcionais):**
```json
{
  "name": "Tech Solutions SA",
  "email": "novo@techsolutions.com",
  "phone": "47888888888"
}
```

**Respostas:**
- `200 OK`: Empresa atualizada com sucesso
- `400 Bad Request`: Dados inválidos
- `404 Not Found`: Empresa não encontrada
- `409 Conflict`: CNPJ já está em uso por outra empresa

**Exemplo de resposta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Tech Solutions SA",
  "cnpj": "12345678901234",
  "email": "novo@techsolutions.com",
  "phone": "47888888888",
  "address": "Rua das Flores, 123",
  "createdAt": "2025-10-22T10:30:00.000Z",
  "updatedAt": "2025-10-22T11:45:00.000Z"
}
```

---

### 5. **DELETE** `/api/companies/{id}`
Remove uma empresa do sistema permanentemente.

**Parâmetros:**
- `id` (UUID): Identificador único da empresa

**Respostas:**
- `204 No Content`: Empresa deletada com sucesso (sem corpo de resposta)
- `400 Bad Request`: ID inválido
- `404 Not Found`: Empresa não encontrada

---

## 📚 Documentação Swagger

A API possui documentação interativa completa com Swagger UI.

### Acessar documentação
```
http://localhost:3000/api-docs
```

### Recursos disponíveis:
- ✅ Interface interativa "Try it out"
- ✅ Todos os endpoints documentados
- ✅ Schemas de validação detalhados
- ✅ Exemplos de requisições e respostas
- ✅ Códigos de erro com descrições
- ✅ Exportação para Postman/Insomnia
- ✅ Tema escuro moderno

### Exportar para Postman/Insomnia
```
http://localhost:3000/api-docs.json
```

---

## 🗂️ Estrutura do Projeto

```
company-management-api/
├── prisma/
│   ├── schema.prisma              # Schema do banco de dados
│   └── migrations/                # Histórico de migrações
│
├── src/
│   ├── core/                      # Núcleo (Domain + Application)
│   │   ├── entities/
│   │   │   └── Company.ts         # Entidade Company
│   │   ├── ports/
│   │   │   └── ICompanyRepository.ts
│   │   ├── services/
│   │   │   └── CompanyService.ts  # Lógica de negócio
│   │   └── errors/
│   │       └── AppError.ts
│   │
│   ├── adapters/                  # Adaptadores externos
│   │   ├── controllers/
│   │   │   └── CompanyController.ts
│   │   ├── repositories/
│   │   │   └── PrismaCompanyRepository.ts
│   │   ├── database/
│   │   │   └── prisma.ts
│   │   ├── validators/
│   │   │   └── companySchemas.ts
│
