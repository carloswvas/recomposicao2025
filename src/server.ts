import Fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './routes'
import { setupSwagger } from './docs'

const app = Fastify({ logger: true })

await app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
})

await setupSwagger(app)
await app.register(appRoutes)

app.listen({ port: 3333 }).then(() => {
  console.log(`Servidor iniciado em http://localhost:3333/users`)
})