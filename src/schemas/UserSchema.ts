import { z } from 'zod'

// 1. CONTRATO EXPLÍCITO (Interface)
// Definimos primeiro a "forma" do dado, independente da validação.
export interface UserDTO {
    name: string;
    age: number;
}

// 2. SCHEMA TIPADO (Implementação)
// Ao usar ': z.ZodType<UserDTO>', nós amarramos o validador à interface.
// Se você adicionar um campo na interface e esquecer aqui, o TypeScript avisa (Erro de compilação).
export const UserSchema: z.ZodType<UserDTO> = z.object({
    name: z
        .string({ message: "O nome é obrigatório e deve ser uma string" })
        .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),

    age: z
        .number({ message: "A idade é obrigatória e deve ser um número" })
        .int({ message: "A idade deve ser um número inteiro" })
        .min(0, { message: "A idade não pode ser negativa" })
})

// Para facilitar a importação em outros lugares, mantemos o alias 'UserData'
export type UserData = UserDTO