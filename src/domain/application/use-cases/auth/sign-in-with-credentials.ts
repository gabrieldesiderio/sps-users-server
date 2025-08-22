import type { UsersRepository } from '@/domain/application/repositories/user-repository'
import type { User } from '@/domain/entities/user'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { InvalidCredentialsError } from '../_errors/invalid-credentials'

interface SignInWithCredentialsUseCaseRequest {
	email: string
	password: string
}

type SignInWithCredentialsUseCaseResponse = Either<
	InvalidCredentialsError,
	{ user: User }
>

export class SignInWithCredentialsUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		email,
		password,
	}: SignInWithCredentialsUseCaseRequest): Promise<SignInWithCredentialsUseCaseResponse> {
		const user = await this.usersRepository.findByEmail(email)

		if (!user || user.password !== password) {
			return makeLeft(new InvalidCredentialsError())
		}

		return makeRight({
			user,
		})
	}
}
