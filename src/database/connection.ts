import pg from 'pg'

const { Pool } = pg

// Criamos o pool usando a string de conexão do .env
export const db = new Pool({
    connectionString: process.env.DATABASE_URL,
})
