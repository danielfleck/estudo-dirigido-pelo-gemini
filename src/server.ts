import express, { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

const PORT: number = 3001
const HTTP_OK: number = 200
const HTTP_CREATE: number = 201
const HTTP_BAD_REQUEST = 400
const HTTP_NOT_FOUND: number = 404

interface User {
    id: string;
    name: string;
    age: number;
}

const users: User[] = [
    { id: uuidv4(), name: "Daniel", age: 45 },
    { id: uuidv4(), name: "Lucas", age: 20 },
]

const app = express()

app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    
    return res.json({
        message: "Hello World!",
        timestamp: new Date(),
    })

})

app.get("/users", (req: Request, res: Response) => {

    return res.status(HTTP_OK).json(users)

})

app.post("/users", (req: Request, res: Response) => {

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

})

app.use((req: Request, res: Response) =>{
    return res.status(HTTP_NOT_FOUND).send()
})

const server = app.listen(PORT, () => {
    console.log(`Servidor ouvindo na porta ${PORT}`)
})

server.on("error", (error: NodeJS.ErrnoException) => {
    console.log(error.code)
})
