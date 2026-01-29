import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getDatabaseConnection } from '../database/connection'
import { Database } from 'sqlite'

const HTTP_OK: number = 200
const HTTP_CREATE: number = 201
const HTTP_NO_CONTENT: number = 204
const HTTP_BAD_REQUEST: number = 400
const HTTP_NOT_FOUND: number = 404

interface User {
    id: string;
    name: string;
    age: number;
}

class UserController {

    async index(req: Request, res: Response) {

        const db: Database = await getDatabaseConnection()

        const users = await db.all<User[]>('SELECT * FROM users')

        return res.status(HTTP_OK).json(users)
    }

    async store(req: Request, res: Response) {

        const { name, age } = req.body

        if (!name || !age) {
            return res.status(HTTP_BAD_REQUEST).json({
                message: "Name and age are required"
            })
        }

        const newUser: User = {
            id: uuidv4(),
            name,
            age,
        }

        const db: Database = await getDatabaseConnection()

        await db.run('INSERT INTO users (id, name, age) VALUES (?, ?, ?)', [newUser.id, newUser.name, newUser.age])

        return res.status(HTTP_CREATE).json(newUser)

    }

    async update(req: Request, res: Response) {

        const { id } = req.params
        const { name, age } = req.body

        if (!name || !age) {
            return res.status(HTTP_BAD_REQUEST).json({
                message: "Name and age are required"
            })
        }

        const db: Database = await getDatabaseConnection()

        const result = await db.run(
            'UPDATE users SET name = ?, age = ? WHERE id = ?',
            [name, age, id]
        )

        if (result.changes === 0) {
            return res.status(HTTP_NOT_FOUND).json({
                error: "User not found"
            })
        }

        return res.status(HTTP_OK).json({ id, name, age })

    }

    async delete(req: Request, res: Response) {

        const { id } = req.params

        const db: Database = await getDatabaseConnection()

        const result = await db.run(
            'DELETE FROM users WHERE id = ?',
            [id]
        )

        if (result.changes === 0) {
            return res.status(HTTP_NOT_FOUND).json({
                error: "User not found"
            })
        }

        return res.status(HTTP_NO_CONTENT).send()

    }

}

export default new UserController
