import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

const HTTP_OK: number = 200
const HTTP_CREATE: number = 201
const HTTP_BAD_REQUEST: number = 400

interface User {
    id: string;
    name: string;
    age: number;
}

const users: User[] = [
    { id: uuidv4(), name: "Daniel", age: 45 },
    { id: uuidv4(), name: "Lucas", age: 20 },
]

class UserController {

    index(req: Request, res: Response) {
        return res.status(HTTP_OK).json(users)
    }

    store(req: Request, res: Response) {

        const { name, age }: User = req.body

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

        users.push(newUser)

        return res.status(HTTP_CREATE).json(newUser)

    }

}

export default new UserController
