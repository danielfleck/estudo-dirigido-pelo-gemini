import pg from 'pg'

const { Pool } = pg

// Configuração de SSL para produção
// Bancos como Render e Neon exigem 'ssl: true' ou com 'rejectUnauthorized: false'
const isProduction = process.env.NODE_ENV === 'production'

export const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : undefined
})
