import express, { Request, Response } from 'express'
import routes from './routes'
import { getDatabaseConnection } from './database/connection'

const app = express()

const PORT: number = 3001
const HTTP_NOT_FOUND: number = 404

app.use(express.json())

app.use(routes)

async function initializeDatabase() {
    const db = await getDatabaseConnection()

    console.log("🔌 Conectou ao banco SQLite")

    await db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER NOT NULL
        )
    `)

    console.log("📦 Tabela 'users' verificada/criada com sucesso")
}

app.use((req: Request, res: Response) => {
    return res.status(HTTP_NOT_FOUND).send()
})

initializeDatabase().then(() => {

    const server = app.listen(PORT, () => {
        console.log(`Servidor ouvindo na porta ${PORT}`)
    })

    server.on("error", (error: NodeJS.ErrnoException) => {
        console.log(error.code)
    })

})
