import { compare, hash } from 'bcryptjs'

export class Cryptography {
	private readonly saltRounds: number

	constructor(saltRounds: number = 6) {
		this.saltRounds = saltRounds
	}

	/**
	 * Gera um hash seguro da senha
	 * @param plainPassword Senha em texto plano
	 */
	async hashPassword(plainPassword: string): Promise<string> {
		return await hash(plainPassword, this.saltRounds)
	}

	/**
	 * Compara a senha informada com o hash salvo
	 * @param plainPassword Senha em texto plano
	 * @param hashedPassword Hash salvo no banco
	 */
	async verifyPassword(
		plainPassword: string,
		hashedPassword: string
	): Promise<boolean> {
		return await compare(plainPassword, hashedPassword)
	}
}
