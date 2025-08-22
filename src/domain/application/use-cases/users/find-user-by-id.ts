import type { UsersRepository } from '@/domain/application/repositories/user-repository'
import type { User } from '@/domain/entities/user'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { NotFoundError } from '../_errors/not-found'

interface FindUserByIdUseCaseRequest {
	userId: string
}

type FindUserByIdUseCaseResponse = Either<
	NotFoundError,
	{
		user: User
	}
>

export class FindUserByIdUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		userId,
	}: FindUserByIdUseCaseRequest): Promise<FindUserByIdUseCaseResponse> {
		const user = await this.usersRepository.findById(userId)

		if (!user) {
			return makeLeft(new NotFoundError('Usuário não encontrado'))
		}

		return makeRight({ user })
	}
}
