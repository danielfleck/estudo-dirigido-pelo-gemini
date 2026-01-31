import 'dotenv/config' // Deve ser a primeira linha
import express, { Request, Response } from 'express'
import routes from './routes/index.js'
import { setupDatabase } from './database/setup.js'
import swaggerUi from 'swagger-ui-express' // Importação da UI
import { swaggerDocument } from './swagger.js' // Importação do arquivo de configuração

const app = express()

const HTTP_NOT_FOUND: number = 404
const PORT = process.env.PORT || 3000

app.use(express.json())

// --- ROTA DA DOCUMENTAÇÃO ---
// Acessível em: http://localhost:3000/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(routes)

app.use((req: Request, res: Response) => {
    return res.status(HTTP_NOT_FOUND).json({ error: 'Rota não encontrada' })
})

// Função de Boot
async function startServer() {
    // 1. Configura o banco primeiro
    await setupDatabase()

    // 2. Sobe o servidor
    const server = app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`)
    })

    server.on("error", (error: any) => {
        console.error("Erro no servidor:", error.code)
    })
}

startServer()
