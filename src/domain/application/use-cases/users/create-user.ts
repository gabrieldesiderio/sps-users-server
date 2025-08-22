import type { UsersRepository } from '@/domain/application/repositories/user-repository'
import { User } from '@/domain/entities/user'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { ConflictError } from '../_errors/conflict'

interface CreateUserUseCaseRequest {
	name: string
	email: string
	password: string
}

type CreateUserUseCaseResponse = Either<ConflictError, { user: User }>

export class CreateUserUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		name,
		email,
		password,
	}: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
		const userWithTheSameEmail = await this.usersRepository.findByEmail(email)

		if (userWithTheSameEmail) {
			return makeLeft(
				new ConflictError('Já existe um usuário com o e-mail informado')
			)
		}

		const user = User.create({
			name,
			email,
			password,
			createdAt: new Date(),
		})

		await this.usersRepository.create(user)

		return makeRight({
			user,
		})
	}
}
