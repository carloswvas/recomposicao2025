import { FastifyInstance } from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'

export async function setupSwagger(fastify: FastifyInstance) {
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'API de Usuários',
        description: 'Documentação da API para recomposição de aprendizagem da unidade interação com API 2025',
        version: '1.0.0',
      },
      host: 'localhost:3333',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    }
  })

  await fastify.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  })
}
