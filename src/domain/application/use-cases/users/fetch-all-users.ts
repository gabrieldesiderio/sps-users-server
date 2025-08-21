import type { UsersRepository } from '@/domain/application/repositories/user-repository'
import type { User } from '@/domain/entities/user'
import { type Either, makeRight } from '@/infra/shared/either'

type FetchAllUsersUseCaseResponse = Either<
	null,
	{
		users: User[]
	}
>

export class FetchAllUsersUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute(): Promise<FetchAllUsersUseCaseResponse> {
		const users = await this.usersRepository.fetchAll()

		return makeRight({ users })
	}
}
