import { v4 as uuidv4 } from 'uuid'
import { getDatabaseConnection } from '../database/connection'

export interface User {
    id: string;
    name: string;
    age: number;
}

export class UserRepository {

    // Método para SALVAR
    async create(name: string, age: number): Promise<User> {
        const db = await getDatabaseConnection()
        const id = uuidv4()

        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO users (id, name, age) VALUES (?, ?, ?)'

            // O driver nativo exige callback
            db.run(sql, [id, name, age], (error: Error | null) => {
                if (error) {
                    reject(error)
                } else {
                    resolve({ id, name, age })
                }
            })
        })
    }

    // Método para LISTAR TODOS
    async findAll(): Promise<User[]> {
        const db = await getDatabaseConnection()

        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users'

            db.all(sql, (error: Error | null, rows: any[]) => {
                if (error) {
                    reject(error)
                } else {
                    // Forçamos o tipo do retorno do banco para nossa Interface
                    resolve(rows as User[])
                }
            })
        })
    }

    // Método para ATUALIZAR
    async update(id: string, name: string, age: number): Promise<boolean> {
        const db = await getDatabaseConnection()

        return new Promise((resolve, reject) => {
            const sql = 'UPDATE users SET name = ?, age = ? WHERE id = ?'

            // Usamos 'function' (não arrow) para ter acesso ao 'this.changes'
            db.run(sql, [name, age, id], function (this: any, error: Error | null) {
                if (error) {
                    reject(error)
                } else {
                    // this.changes indica quantas linhas foram afetadas
                    resolve(this.changes > 0)
                }
            })
        })
    }

    // Método para DELETAR
    async delete(id: string): Promise<boolean> {
        const db = await getDatabaseConnection()

        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM users WHERE id = ?'

            db.run(sql, [id], function (this: any, error: Error | null) {
                if (error) {
                    reject(error)
                } else {
                    resolve(this.changes > 0)
                }
            })
        })
    }
}