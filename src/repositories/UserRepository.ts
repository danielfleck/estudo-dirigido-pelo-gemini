import { v4 as uuidv4 } from 'uuid'
import { db } from '../database/connection.js'

export interface User {
    id: string;
    name: string;
    age: number;
    password: string;
}

export class UserRepository {

    // Agora aceitamos password
    async create(name: string, age: number, passwordHash: string): Promise<User> {
        const id = uuidv4()

        const sql = 'INSERT INTO users (id, name, age, password) VALUES ($1, $2, $3, $4)'

        await db.query(sql, [id, name, age, passwordHash])

        return { id, name, age, password: passwordHash }
    }

    async findAll(): Promise<User[]> {
        const sql = 'SELECT id, name, age FROM users'

        const result = await db.query<User>(sql)

        // O resultado real fica dentro de .rows
        return result.rows
    }

    async update(id: string, name: string, age: number): Promise<boolean> {
        const sql = 'UPDATE users SET name = $1, age = $2 WHERE id = $3'

        const result = await db.query(sql, [name, age, id])

        // .rowCount diz quantas linhas foram afetadas
        // (result.rowCount ?? 0) garante que seja número mesmo se vier null
        return (result.rowCount ?? 0) > 0
    }

    async delete(id: string): Promise<boolean> {
        const sql = 'DELETE FROM users WHERE id = $1'

        const result = await db.query(sql, [id])

        return (result.rowCount ?? 0) > 0
    }

    // --- NOVO MÉTODO PARA LOGIN ---
    // Precisamos buscar pelo nome para conferir a senha depois
    async findByName(name: string): Promise<User | null> {
        // Aqui precisamos selecionar a SENHA também, pois precisaremos dela para o login
        const sql = 'SELECT * FROM users WHERE name = $1 LIMIT 1'

        const result = await db.query<User>(sql, [name])

        // Se achou, retorna o primeiro. Se não, retorna null.
        return result.rows[0] || null
    }
}