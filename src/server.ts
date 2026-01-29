import express, { Request, Response } from 'express'
import routes from './routes'

const PORT: number = 3001
const HTTP_NOT_FOUND: number = 404

const app = express()

app.use(express.json())

app.use(routes)

app.use((req: Request, res: Response) => {
    return res.status(HTTP_NOT_FOUND).send()
})

const server = app.listen(PORT, () => {
    console.log(`Servidor ouvindo na porta ${PORT}`)
})

server.on("error", (error: NodeJS.ErrnoException) => {
    console.log(error.code)
})
