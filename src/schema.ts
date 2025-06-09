import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { z } from 'zod';

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    nome: text('nome').notNull(),
    email: text('email').notNull().unique(),
    idade: integer('idade').notNull()
})

export const UserSchema = z.object({
    id: z.number().int().optional(),
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("E-mail inválido"),
    idade: z.number().int().min(0, "Idade deve ser positiva"),
})

export const idUserSchema = z.object({
  id: z.coerce.number().int().positive()
})