import { FastifyInstance } from 'fastify'
import { db } from './db'
import { users, UserSchema, idUserSchema } from './schema'
import { userSchema } from './schema-swagger'
import { eq } from 'drizzle-orm'


export async function appRoutes(fastify: FastifyInstance) {
    fastify.get('/users', {
        schema: {
            tags: ['Usuários'],
            response: {
                200: {
                    description: "Lista todos os usuários",
                    type: 'array',
                    items: userSchema
                }
            }
        }
    }, async (request, reply) => {
        const selectAll = await db.select().from(users)
        return reply.status(200).send(selectAll)
    })

    fastify.post('/users', {
        schema: {
            tags: ['Usuários'],
            body: userSchema,
            response: {
                201: {
                    description: 'Usuário criado',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const parsed = UserSchema.safeParse(request.body)

        if (!parsed.success) {
            return reply.status(400).send({
                error: 'Dados Inválidos',
                issues: parsed.error.issues.map(issue => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                    code: issue.code
                }))
            })
        }

        const { nome, email, idade } = parsed.data

        await db.insert(users).values({ nome, email, idade })

        return reply.status(201).send({ message: 'Usuário cadastrado com sucesso!' })
    })

    fastify.delete('/users/:id', {
        schema: {
            tags: ['Usuários'],
            response: {
                201: {
                    description: 'Usuário Excluído',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const parsed = idUserSchema.safeParse(request.params)

        if (!parsed.success) {
            return reply.status(400).send({
                error: 'Dados Inválidos',
                message: "ID Inválido"
            })
        }

        const userId = parsed.data.id

        const encontrarPessoa = await db.select().from(users).where(eq(users.id, userId))

        if (encontrarPessoa.length === 0) {
            return reply.status(404).send({ mensagem: "Pessoa não encontrada" })
        }

        await db.delete(users).where(eq(users.id, userId))

        return reply.status(200).send({ mensagem: 'Usuário excluído' })
    })
}




