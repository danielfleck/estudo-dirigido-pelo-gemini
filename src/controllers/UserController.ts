import { Request, Response } from 'express'
import { UserRepository } from '../repositories/UserRepository'

const HTTP_OK: number = 200
const HTTP_CREATE: number = 201
const HTTP_NO_CONTENT: number = 204
const HTTP_BAD_REQUEST: number = 400
const HTTP_NOT_FOUND: number = 404
const HTTP_INTERNAL_SERVER_ERROR: number = 500

// Instanciamos o repositório
const userRepository = new UserRepository()

export class UserController {

    async index(req: Request, res: Response) {

        try {
            // O Controller apenas pede: "Me traga todos"
            // Ele não sabe se veio do SQLite ou da Lua.
            const users = await userRepository.findAll()

            return res.status(HTTP_OK).json(users)
        } catch (error) {
            console.error(error)
            return res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: 'Erro ao buscar usuários' })
        }
    }

    async store(req: Request, res: Response) {
        const { name, age } = req.body

        // Validação (Regra de Negócio continua aqui)
        if (!name || !age) {
            return res.status(HTTP_BAD_REQUEST).json({ error: 'Nome e idade são obrigatórios' })
        }

        try {
            // O Controller apenas ordena: "Crie este usuário"
            const newUser = await userRepository.create(name, age)

            return res.status(HTTP_CREATE).json(newUser)
        } catch (error) {
            console.error(error)
            return res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: 'Erro ao criar usuário' })
        }
    }

    async update(req: Request, res: Response) {
        // O ID vem da URL (ex: /users/123) -> req.params
        const id = req.params.id as string
        const { name, age } = req.body

        if (!name || !age) {
            return res.status(HTTP_BAD_REQUEST).json({ error: 'Nome e idade são obrigatórios para atualização' })
        }

        try {
            const sucesso = await userRepository.update(id, name, age)

            if (sucesso) {
                // Se atualizou, devolvemos os dados novos
                return res.status(HTTP_OK).json({ id, name, age })
            } else {
                return res.status(HTTP_NOT_FOUND).json({ error: 'Usuário não encontrado' })
            }
        } catch (error) {
            console.error(error)
            return res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: 'Erro ao atualizar usuário' })
        }
    }

    async delete(req: Request, res: Response) {
        const id = req.params.id as string

        try {
            const sucesso = await userRepository.delete(id)

            if (sucesso) {
                // 204 No Content: Deu certo, mas não tenho nada pra te mostrar (ele sumiu)
                return res.status(HTTP_NO_CONTENT).send()
            } else {
                return res.status(HTTP_NOT_FOUND).json({ error: 'Usuário não encontrado' })
            }
        } catch (error) {
            console.error(error)
            return res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: 'Erro ao deletar usuário' })
        }
    }
}

export default new UserController()