import type { UsersRepository } from '@/domain/application/repositories/user-repository'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { ConflictError } from '../_errors/conflict'
import { NotFoundError } from '../_errors/not-found'

interface EditUserUseCaseRequest {
	userId: string
	name: string
	email: string
	password: string
	type: 'admin' | 'default'
}

type EditUserUseCaseResponse = Either<NotFoundError | ConflictError, null>

export class EditUserUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		userId,
		name,
		email,
		password,
		type,
	}: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
		const user = await this.usersRepository.findById(userId)

		if (!user) {
			return makeLeft(new NotFoundError('Usuário não encontrado'))
		}

		const userWithTheSameEmail = await this.usersRepository.findByEmail(email)

		if (userWithTheSameEmail && userWithTheSameEmail.id.toString() !== userId) {
			return makeLeft(
				new ConflictError('Já existe um usuário com o e-mail informado')
			)
		}

		user.name = name
		user.email = email
		user.password = password
		user.type = type

		await this.usersRepository.save(user)

		return makeRight(null)
	}
}
