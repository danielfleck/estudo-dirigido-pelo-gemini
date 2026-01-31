import { Request, Response } from 'express'
import AuthService from '../services/AuthService'

const HTTP_OK = 200
const HTTP_BAD_REQUEST = 400
const HTTP_UNAUTHORIZED = 401

export class AuthController {

    async authenticate(req: Request, res: Response) {
        const { name, password } = req.body

        // Validação básica de entrada
        if (!name || !password) {
            return res.status(HTTP_BAD_REQUEST).json({ error: "Nome e senha são obrigatórios" })
        }

        try {
            // Chamamos o serviço que contém a regra de negócio (Bcrypt + JWT)
            const result = await AuthService.login(name, password)

            // Retornamos o Token e os dados do usuário (sem a senha)
            return res.status(HTTP_OK).json(result)

        } catch (error: any) {
            // Se o serviço lançar erro (senha errada ou usuário inexistente),
            // retornamos 401 (Não Autorizado) para não dar dicas.
            return res.status(HTTP_UNAUTHORIZED).json({ error: error.message })
        }
    }
}

export default new AuthController()