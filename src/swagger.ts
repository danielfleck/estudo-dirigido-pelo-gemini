export const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'API de Planejamento e Usuários',
        version: '1.0.0',
        description: 'API para gestão de efetivo e autenticação (Node.js + TypeScript + Postgres)',
        contact: {
            name: 'Daniel',
            email: 'danielfleck@gmail.com'
        }
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Servidor de Desenvolvimento'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    },
    paths: {
        '/login': {
            post: {
                summary: 'Autenticação de Usuário',
                description: 'Recebe credenciais e retorna um token JWT (Bearer Token).',
                tags: ['Autenticação'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', example: 'Daniel' },
                                    password: { type: 'string', example: '123456' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Login realizado com sucesso',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        token: { type: 'string' },
                                        user: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'string' },
                                                name: { type: 'string' },
                                                age: { type: 'integer' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: { description: 'Credenciais inválidas' }
                }
            }
        },
        '/users': {
            get: {
                summary: 'Listar Usuários',
                tags: ['Usuários'],
                security: [{ bearerAuth: [] }], // Exige Token
                responses: {
                    200: { description: 'Lista de usuários retornada com sucesso' },
                    401: { description: 'Não autorizado (Token ausente ou inválido)' }
                }
            },
            post: {
                summary: 'Criar Novo Usuário',
                tags: ['Usuários'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'age', 'password'],
                                properties: {
                                    name: { type: 'string', minLength: 3 },
                                    age: { type: 'integer', minimum: 0 },
                                    password: { type: 'string', minLength: 6 }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'Usuário criado com sucesso' },
                    400: { description: 'Erro de validação (Zod)' }
                }
            }
        },
        '/users/{id}': {
            put: {
                summary: 'Atualizar Usuário',
                tags: ['Usuários'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    age: { type: 'integer' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Usuário atualizado' },
                    404: { description: 'Usuário não encontrado' }
                }
            },
            delete: {
                summary: 'Remover Usuário',
                tags: ['Usuários'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' }
                    }
                ],
                responses: {
                    204: { description: 'Usuário removido com sucesso' },
                    404: { description: 'Usuário não encontrado' }
                }
            }
        }
    }
}