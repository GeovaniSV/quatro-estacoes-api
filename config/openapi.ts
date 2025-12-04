import { defineConfig } from '@foadonis/openapi'

export default defineConfig({
  ui: 'scalar',
  document: {
    info: {
      title: '4 Estações Vasos & Acessórios',
      version: '1.0.0',
      description:
        '4 Estações Vasos & Acessórios API oferece uma interface de aplicação para vendas de vasos online para a loja 4 Estações Vasos & Acessórios, facilitando a integração da loja com os clientes online.',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'opaque',
        },
        AdminAuth: {
          type: 'apiKey', // não existe "role" em OpenAPI, então simulamos
          in: 'header',
          name: 'X-Admin-Auth',
          description: 'Necessário ser administrador. Middleware customizado do sistema.',
        },
      },
    },
  },
})
