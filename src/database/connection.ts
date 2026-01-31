import sqlite3 from 'sqlite3'

// 1. Precisamos importar o tipo 'Database' para o TypeScript entender o retorno
import { Database } from 'sqlite3'

export async function getDatabaseConnection(): Promise<Database> {
    return new Promise((resolve, reject) => {
        // 2. Usamos o driver nativo 'sqlite3.Database'
        // Ele tenta abrir o arquivo. Se não existir, cria.
        const db = new sqlite3.Database(process.env.DATABASE_PATH as string, (error) => {
            if (error) {
                console.error("❌ Erro ao conectar no SQLite:", error)
                reject(error)
            } else {
                console.log("🔌 Conectou ao banco SQLite!!!")
                // Sucesso! Retornamos a instância do banco
                resolve(db)
            }
        })
    })
}