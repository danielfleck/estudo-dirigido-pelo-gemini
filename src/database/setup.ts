import { db } from './connection'

export async function setupDatabase() {
    try {
        console.log("🔌 Conectando ao Postgres...")

        // Pequeno teste para garantir que o Docker está respondendo
        await db.query('SELECT NOW()')

        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                age INTEGER NOT NULL
            );
        `

        await db.query(sql)
        console.log("📦 Tabela 'users' verificada/criada com sucesso")

    } catch (error) {
        console.error("❌ Erro ao conectar/configurar banco:", error)
        console.error("Dica: Verifique se o Docker está rodando (docker compose up -d)")
        process.exit(1)
    }
}