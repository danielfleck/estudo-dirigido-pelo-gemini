import { Request, Response } from 'express'
import UserService from '../services/UserService' // Importa o Service

// Constantes HTTP
const HTTP_OK = 200
const HTTP_CREATED = 201
const HTTP_NO_CONTENT = 204
const HTTP_BAD_REQUEST = 400
const HTTP_NOT_FOUND = 404
const HTTP_INTERNAL_SERVER_ERROR = 500

export class UserController {

    async index(req: Request, res: Response) {
        try {
            const users = await UserService.findAll()
            return res.status(HTTP_OK).json(users)
        } catch (error) {
            return res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: 'Erro ao buscar usuários' })
        }
    }

    async store(req: Request, res: Response) {
        const { name, age } = req.body

        // Validação de entrada (Formato)
        if (!name || !age) {
            return res.status(HTTP_BAD_REQUEST).json({ error: 'Nome e idade são obrigatórios' })
        }

        try {
            // Delega para o Service (Regra)
            const newUser = await UserService.create(name, age)
            return res.status(HTTP_CREATED).json(newUser)
        } catch (error: any) {
            // Captura erro de regra de negócio
            return res.status(HTTP_BAD_REQUEST).json({ error: error.message })
        }
    }

    async update(req: Request, res: Response) {
        const id = req.params.id as string
        const { name, age } = req.body

        if (!name || !age) {
            return res.status(HTTP_BAD_REQUEST).json({ error: 'Nome e idade são obrigatórios' })
        }

        try {
            const updatedUser = await UserService.update(id, name, age)
            return res.status(HTTP_OK).json(updatedUser)
        } catch (error: any) {
            if (error.message === "Usuário não encontrado") {
                return res.status(HTTP_NOT_FOUND).json({ error: error.message })
            }
            return res.status(HTTP_BAD_REQUEST).json({ error: error.message })
        }
    }

    async delete(req: Request, res: Response) {
        const id = req.params.id as string

        try {
            await UserService.delete(id)
            return res.status(HTTP_NO_CONTENT).send()
        } catch (error: any) {
            if (error.message === "Usuário não encontrado") {
                return res.status(HTTP_NOT_FOUND).json({ error: error.message })
            }
            return res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: 'Erro ao deletar usuário' })
        }
    }
}

export default new UserController()