import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserRepository } from '../repositories/UserRepository'

const userRepository = new UserRepository()

export class AuthService {

    async login(name: string, passwordPlain: string) {
        // 1. Buscamos o usuário pelo nome
        const user = await userRepository.findByName(name)

        // 2. Se não achou o usuário, aborta.
        if (!user) {
            throw new Error("Usuário ou senha incorretos")
        }

        // 3. Se achou, precisamos conferir a senha.
        // O user.password vem do banco (hash). O passwordPlain vem do formulário.
        if (!user.password) {
            throw new Error("Usuário sem senha definida")
        }

        const passwordMatch = await compare(passwordPlain, user.password)

        // 4. Se a senha não bater, aborta.
        if (!passwordMatch) {
            throw new Error("Usuário ou senha incorretos")
        }

        // 5. Se chegou até aqui, o Login é válido! Vamos gerar a pulseira (Token).

        // O segredo vem do .env (Se não tiver, usa um padrão inseguro para não crashar em dev)
        const secret = process.env.JWT_SECRET || 'segredo_padrao'

        // O Token carrega informações.
        // payload: Dados públicos (não coloque senhas aqui!).
        // subject: O "dono" do token (geralmente o ID).
        // expiresIn: Validade.
        const token = jwt.sign(
            { name: user.name, age: user.age }, // Payload
            secret,                             // Chave de Assinatura
            { subject: user.id, expiresIn: '1d' } // Configurações
        )

        // Retornamos o token e os dados do usuário (sem a senha)
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                age: user.age
            }
        }
    }
}

export default new AuthService()