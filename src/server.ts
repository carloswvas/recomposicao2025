import 'dotenv/config'
import Fastify from 'fastify'
import { eq } from 'drizzle-orm';
import { z } from "zod/v4";
import { db } from './db';
import { users } from './schema';

const fastify = Fastify({ logger: true })

const UserSchema = z.object({
  id: z.number().int().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.email("E-mail inválido"),
  idade: z.number().int().min(0, "Idade deve ser positiva"),
})

const idUserSchema = z.object({
  id: z.coerce.number().int().positive()
})

export type User = z.infer<typeof UserSchema>;
export type idUser = z.infer<typeof idUserSchema>;

fastify.get('/users', async (request, reply) => {
  const selectAll = await db.select().from(users)
  return selectAll
})

fastify.post('/users', async (request, reply) => {
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

fastify.delete('/users/:id', async (request, reply) => {
  const parsed = idUserSchema.safeParse(request.params)

  if(!parsed.success){
    return reply.status(400).send({
      error: 'Dados Inválidos',
      message: "ID Inválido"
    })
  }

  const userId = parsed.data.id

  const encontrarPessoa = await db.select().from(users).where(eq(users.id, userId))

  if(encontrarPessoa.length === 0){
    return reply.status(404).send({mensagem: "Pessoa não encontrada"})
  }

  await db.delete(users).where(eq(users.id, userId))

  return reply.status(200).send({ mensagem: 'Usuário excluído' })
})

fastify.listen({ port: 3333 }).then(() => {
  console.log(`Servidor iniciado em http://localhost:3333/users`)
})