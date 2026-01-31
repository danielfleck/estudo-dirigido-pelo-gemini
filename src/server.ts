import express, { Request, Response } from 'express'
import routes from './routes'
// Certifique-se de que o nome da função no import bate com o que está no arquivo connection.ts
// Antes chamamos de 'connect', aqui você usou 'getDatabaseConnection'. Ajuste conforme seu arquivo.
import { getDatabaseConnection } from './database/connection'

const app = express()

const PORT: number = 3000
const HTTP_NOT_FOUND: number = 404

app.use(express.json())
app.use(routes)

async function initializeDatabase() {
    // 1. Obtém a instância do banco
    const db = await getDatabaseConnection()

    // 2. CORREÇÃO TÉCNICA: Usar db.exec para criação de tabelas (DDL)
    // db.exec é ideal para rodar scripts de estrutura, enquanto db.run é para queries parametrizadas (?, ?)
    await new Promise<void>((resolve, reject) => {

        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                age INTEGER NOT NULL
            );
        `

        db.run(sql, (error: Error | null) => {
            if (error) {
                console.error("❌ Erro ao criar tabela:", error)
                reject(error)
            } else {
                resolve()
            }
        })
    })

    console.log("📦 Tabela 'users' verificada/criada com sucesso")
}

app.use((req: Request, res: Response) => {
    return res.status(HTTP_NOT_FOUND).send()
})

// Inicialização segura
initializeDatabase().then(() => {

    const server = app.listen(PORT, () => {
        console.log(`🚀 Servidor ouvindo na porta ${PORT}`)
    })

    server.on("error", (error: NodeJS.ErrnoException) => {
        console.log(error.code)
    })

}).catch(err => {
    console.error("Erro fatal na inicialização:", err)
})