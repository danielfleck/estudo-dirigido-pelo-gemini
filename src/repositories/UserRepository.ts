import { v4 as uuidv4 } from 'uuid'
import { db } from '../database/connection'

export interface User {
    id: string;
    name: string;
    age: number;
}

export class UserRepository {

    async create(name: string, age: number): Promise<User> {
        const id = uuidv4()

        // NO POSTGRES: Usamos $1, $2, $3... em vez de ?
        const sql = 'INSERT INTO users (id, name, age) VALUES ($1, $2, $3)'

        await db.query(sql, [id, name, age])

        return { id, name, age }
    }

    async findAll(): Promise<User[]> {
        const sql = 'SELECT * FROM users'

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
}