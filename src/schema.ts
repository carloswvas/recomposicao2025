import {sqliteTable, text, integer} from "drizzle-orm/sqlite-core"

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({autoIncrement: true}),
    nome:text('nome').notNull(),
    email:text('email').notNull().unique(),
    idade: integer('idade').notNull()
})