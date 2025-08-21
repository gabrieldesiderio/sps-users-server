import type { UsersRepository } from '@/domain/application/repositories/user-repository'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { NotFoundError } from '../_errors/not-found'

interface DeleteUserUseCaseRequest {
	userId: string
}

type DeleteUserUseCaseResponse = Either<NotFoundError, null>

export class DeleteUserUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		userId,
	}: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
		const user = await this.usersRepository.findById(userId)

		if (!user) {
			return makeLeft(
				new NotFoundError('Já existe um usuário com o e-mail informado')
			)
		}

		await this.usersRepository.delete(user)

		return makeRight(null)
	}
}
