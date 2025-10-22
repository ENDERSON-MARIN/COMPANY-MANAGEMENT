export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Company Management API",
    version: "1.0.0",
    description:
      "API REST para sistema de consulta e gestão simplificada de empresas",
    contact: {
      name: "API Support",
      email: "support@companyapi.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor de Desenvolvimento",
    },
    {
      url: "https://api.production.com",
      description: "Servidor de Produção",
    },
  ],
  tags: [
    {
      name: "Companies",
      description: "Endpoints para gerenciamento de empresas",
    },
  ],
  paths: {
    "/api/companies": {
      post: {
        tags: ["Companies"],
        summary: "Criar nova empresa",
        description: "Cria uma nova empresa no sistema",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateCompanyInput",
              },
              examples: {
                completo: {
                  summary: "Empresa com todos os campos",
                  value: {
                    name: "Tech Solutions LTDA",
                    cnpj: "12345678901234",
                    email: "contato@techsolutions.com",
                    phone: "47999999999",
                    address: "Rua das Flores, 123",
                  },
                },
                minimo: {
                  summary: "Empresa com campos mínimos",
                  value: {
                    name: "Tech Solutions LTDA",
                    cnpj: "12345678901234",
                    email: "contato@techsolutions.com",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Empresa criada com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Company",
                },
                example: {
                  id: "550e8400-e29b-41d4-a716-446655440000",
                  name: "Tech Solutions LTDA",
                  cnpj: "12345678901234",
                  email: "contato@techsolutions.com",
                  phone: "47999999999",
                  address: "Rua das Flores, 123",
                  createdAt: "2025-10-21T10:30:00.000Z",
                  updatedAt: "2025-10-21T10:30:00.000Z",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
                example: {
                  error: "Validation error",
                  details: [
                    {
                      code: "invalid_string",
                      message: "CNPJ must have 14 digits",
                      path: ["cnpj"],
                    },
                  ],
                },
              },
            },
          },
          "409": {
            description: "CNPJ já cadastrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  error: "Company with this CNPJ already exists",
                },
              },
            },
          },
          "500": {
            description: "Erro interno do servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["Companies"],
        summary: "Listar todas as empresas",
        description:
          "Retorna uma lista de todas as empresas cadastradas, ordenadas por data de criação (mais recentes primeiro)",
        responses: {
          "200": {
            description: "Lista de empresas retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Company",
                  },
                },
                example: [
                  {
                    id: "550e8400-e29b-41d4-a716-446655440000",
                    name: "Tech Solutions LTDA",
                    cnpj: "12345678901234",
                    email: "contato@techsolutions.com",
                    phone: "47999999999",
                    address: "Rua das Flores, 123",
                    createdAt: "2025-10-21T10:30:00.000Z",
                    updatedAt: "2025-10-21T10:30:00.000Z",
                  },
                  {
                    id: "650e8400-e29b-41d4-a716-446655440001",
                    name: "Inovação Digital SA",
                    cnpj: "98765432109876",
                    email: "contato@inovacao.com",
                    phone: "11988887777",
                    address: "Av. Paulista, 1000",
                    createdAt: "2025-10-20T15:20:00.000Z",
                    updatedAt: "2025-10-20T15:20:00.000Z",
                  },
                ],
              },
            },
          },
          "500": {
            description: "Erro interno do servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/companies/{id}": {
      get: {
        tags: ["Companies"],
        summary: "Buscar empresa por ID",
        description: "Retorna os dados de uma empresa específica pelo seu ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID único da empresa (UUID)",
            schema: {
              type: "string",
              format: "uuid",
            },
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
        ],
        responses: {
          "200": {
            description: "Empresa encontrada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Company",
                },
                example: {
                  id: "550e8400-e29b-41d4-a716-446655440000",
                  name: "Tech Solutions LTDA",
                  cnpj: "12345678901234",
                  email: "contato@techsolutions.com",
                  phone: "47999999999",
                  address: "Rua das Flores, 123",
                  createdAt: "2025-10-21T10:30:00.000Z",
                  updatedAt: "2025-10-21T10:30:00.000Z",
                },
              },
            },
          },
          "400": {
            description: "ID inválido (não é um UUID)",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
                example: {
                  error: "Validation error",
                  details: [
                    {
                      code: "invalid_string",
                      message: "Invalid UUID format",
                      path: ["id"],
                    },
                  ],
                },
              },
            },
          },
          "404": {
            description: "Empresa não encontrada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  error: "Company not found",
                },
              },
            },
          },
          "500": {
            description: "Erro interno do servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Companies"],
        summary: "Atualizar empresa",
        description:
          "Atualiza os dados de uma empresa existente. Todos os campos são opcionais.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID único da empresa (UUID)",
            schema: {
              type: "string",
              format: "uuid",
            },
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateCompanyInput",
              },
              examples: {
                parcial: {
                  summary: "Atualização parcial",
                  value: {
                    name: "Tech Solutions SA",
                    email: "novo@techsolutions.com",
                  },
                },
                completa: {
                  summary: "Atualização completa",
                  value: {
                    name: "Tech Solutions SA",
                    cnpj: "12345678901234",
                    email: "novo@techsolutions.com",
                    phone: "47888888888",
                    address: "Nova Rua, 456",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Empresa atualizada com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Company",
                },
                example: {
                  id: "550e8400-e29b-41d4-a716-446655440000",
                  name: "Tech Solutions SA",
                  cnpj: "12345678901234",
                  email: "novo@techsolutions.com",
                  phone: "47999999999",
                  address: "Rua das Flores, 123",
                  createdAt: "2025-10-21T10:30:00.000Z",
                  updatedAt: "2025-10-21T11:45:00.000Z",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
              },
            },
          },
          "404": {
            description: "Empresa não encontrada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  error: "Company not found",
                },
              },
            },
          },
          "409": {
            description: "CNPJ já está em uso por outra empresa",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  error: "Company with this CNPJ already exists",
                },
              },
            },
          },
          "500": {
            description: "Erro interno do servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Companies"],
        summary: "Deletar empresa",
        description: "Remove uma empresa do sistema permanentemente",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID único da empresa (UUID)",
            schema: {
              type: "string",
              format: "uuid",
            },
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
        ],
        responses: {
          "204": {
            description: "Empresa deletada com sucesso (sem conteúdo)",
          },
          "400": {
            description: "ID inválido",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
              },
            },
          },
          "404": {
            description: "Empresa não encontrada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  error: "Company not found",
                },
              },
            },
          },
          "500": {
            description: "Erro interno do servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Company: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            description: "ID único da empresa",
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
          name: {
            type: "string",
            minLength: 3,
            maxLength: 255,
            description: "Nome da empresa",
            example: "Tech Solutions LTDA",
          },
          cnpj: {
            type: "string",
            pattern: "^\\d{14}$",
            description: "CNPJ da empresa (14 dígitos numéricos)",
            example: "12345678901234",
          },
          email: {
            type: "string",
            format: "email",
            description: "Email de contato da empresa",
            example: "contato@techsolutions.com",
          },
          phone: {
            type: "string",
            pattern: "^\\d{10,11}$",
            nullable: true,
            description: "Telefone da empresa (10 ou 11 dígitos)",
            example: "47999999999",
          },
          address: {
            type: "string",
            maxLength: 255,
            nullable: true,
            description: "Endereço da empresa",
            example: "Rua das Flores, 123",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Data de criação do registro",
            example: "2025-10-21T10:30:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Data da última atualização",
            example: "2025-10-21T10:30:00.000Z",
          },
        },
        required: ["id", "name", "cnpj", "email", "createdAt", "updatedAt"],
      },
      CreateCompanyInput: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 3,
            maxLength: 255,
            description: "Nome da empresa",
            example: "Tech Solutions LTDA",
          },
          cnpj: {
            type: "string",
            pattern: "^\\d{14}$",
            description:
              "CNPJ da empresa (14 dígitos numéricos, sem formatação)",
            example: "12345678901234",
          },
          email: {
            type: "string",
            format: "email",
            description: "Email de contato da empresa",
            example: "contato@techsolutions.com",
          },
          phone: {
            type: "string",
            pattern: "^\\d{10,11}$",
            description:
              "Telefone da empresa (10 ou 11 dígitos, sem formatação)",
            example: "47999999999",
          },
          address: {
            type: "string",
            maxLength: 255,
            description: "Endereço completo da empresa",
            example: "Rua das Flores, 123",
          },
        },
        required: ["name", "cnpj", "email"],
      },
      UpdateCompanyInput: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 3,
            maxLength: 255,
            description: "Nome da empresa",
            example: "Tech Solutions SA",
          },
          cnpj: {
            type: "string",
            pattern: "^\\d{14}$",
            description: "CNPJ da empresa (14 dígitos numéricos)",
            example: "12345678901234",
          },
          email: {
            type: "string",
            format: "email",
            description: "Email de contato",
            example: "novo@techsolutions.com",
          },
          phone: {
            type: "string",
            pattern: "^\\d{10,11}$",
            description: "Telefone (10 ou 11 dígitos)",
            example: "47888888888",
          },
          address: {
            type: "string",
            maxLength: 255,
            description: "Endereço",
            example: "Nova Rua, 456",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Mensagem de erro",
            example: "Company not found",
          },
        },
        required: ["error"],
      },
      ValidationError: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Tipo do erro",
            example: "Validation error",
          },
          details: {
            type: "array",
            description: "Detalhes dos erros de validação",
            items: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  example: "invalid_string",
                },
                message: {
                  type: "string",
                  example: "CNPJ must have 14 digits",
                },
                path: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  example: ["cnpj"],
                },
              },
            },
          },
        },
        required: ["error", "details"],
      },
    },
  },
}
