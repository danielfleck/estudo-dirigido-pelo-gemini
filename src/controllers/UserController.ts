import { Request, Response } from 'express'
import UserService from '../services/UserService' // Importa o Service
import { UserSchema } from '../schemas/UserSchema' // Importamos o esquema
import { z } from 'zod'

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
        try {
            // 1. O Zod analisa o corpo da requisição (req.body)
            // Se estiver errado, ele lança um erro aqui mesmo e pula pro catch.
            // Se estiver certo, 'validatedData' terá os dados limpos e tipados.
            const validatedData = UserSchema.parse(req.body)

            // 2. Passamos os dados garantidos para o Service
            const newUser = await UserService.create(validatedData.name, validatedData.age)

            return res.status(HTTP_CREATED).json(newUser)

        } catch (error: any) {
            // Se o erro for do Zod, formatamos para ficar legível
            if (error instanceof z.ZodError) {
                return res.status(HTTP_BAD_REQUEST).json({
                    error: 'Erro de validação',
                    details: error.issues.map((e: any) => e.message) // Lista de mensagens amigáveis
                })
            }

            // Outros erros (Regra de negócio ou Banco)
            return res.status(HTTP_BAD_REQUEST).json({ error: error.message })
        }
    }

    async update(req: Request, res: Response) {
        const id = req.params.id as string

        try {
            // Reutilizamos o mesmo esquema para validar a atualização
            const validatedData = UserSchema.parse(req.body)

            const updatedUser = await UserService.update(id, validatedData.name, validatedData.age)
            return res.status(HTTP_OK).json(updatedUser)

        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(HTTP_BAD_REQUEST).json({
                    error: 'Erro de validação',
                    details: error.issues.map((e: any) => e.message)
                })
            }

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