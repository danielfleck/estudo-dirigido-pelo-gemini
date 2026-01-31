import { UserRepository } from '../repositories/UserRepository';
import { hash } from 'bcryptjs' // Importamos a função de criptografia

const userRepository = new UserRepository();

export class UserService {

    async findAll() {
        return await userRepository.findAll()
    }

    async create(name: string, age: number, passwordPlain: string) {

        // CRIPTOGRAFIA:
        // O número 8 é o "custo" (salt rounds). Quanto maior, mais seguro e mais lento.
        // 8 é um bom equilíbrio para dev. Em produção usamos 10 ou 12.
        const passwordHash = await hash(passwordPlain, 8)

        // Enviamos a hash para o banco, nunca a senha real
        return await userRepository.create(name, age, passwordHash)
    }

    async update(id: string, name: string, age: number) {

        const sucess = await userRepository.update(id, name, age);

        if (!sucess) {
            throw new Error("Usuário não encontrado");
        }

        return { id, name, age }
    }

    async delete(id: string) {
        const sucess = await userRepository.delete(id);

        if (!sucess) {
            throw new Error("Usuário não encontrado");
        }

    }

}

export default new UserService();