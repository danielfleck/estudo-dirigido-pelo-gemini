import { UserRepository } from '../repositories/UserRepository';

const userRepository = new UserRepository();

export class UserService {

    async findAll() {
        return await userRepository.findAll()
    }

    async create(name: string, age: number) {
        if (age < 0) {
            throw new Error("A idade não pode ser negativa");
        }

        return await userRepository.create(name, age);
    }

    async update(id: string, name: string, age: number) {
        if (age < 0) {
            throw new Error("A idade não pode ser negativa");
        }

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

        return
    }

}

export default new UserService();