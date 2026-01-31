import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const { verify } = jwt
const HTTP_UNAUTHORIZED = 401

// Definimos o que esperamos encontrar dentro do Token
interface TokenPayload {
    iat: number;
    exp: number;
    sub: string; // O ID do usuário
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    // 1. Buscamos o token no cabeçalho da requisição
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(HTTP_UNAUTHORIZED).json({ error: "Token não fornecido" })
    }

    // 2. O token vem no formato "Bearer asd876asd876..."
    // Precisamos separar a palavra "Bearer" do código real
    const [, token] = authorization.split(" ")

    try {
        // 3. A Verificação (O Segurança olhando o selo holográfico)
        const secret = process.env.JWT_SECRET || 'segredo_padrao'
        const decoded = verify(token, secret)

        // 4. Se chegou aqui, o token é válido!
        // Extraímos o ID do usuário de dentro do token
        const { sub } = decoded as TokenPayload

        // "Pulo do Gato": Guardamos o ID do usuário para as próximas etapas usarem.
        // O 'res.locals' é o lugar oficial do Express para passar dados entre middlewares.
        res.locals.userId = sub

        // 5. Pode passar!
        return next()

    } catch (error) {
        return res.status(HTTP_UNAUTHORIZED).json({ error: "Token inválido ou expirado" })
    }
}