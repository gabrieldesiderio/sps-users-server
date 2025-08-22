import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import type { UsersRepository } from '@/domain/application/repositories/user-repository'
import { FetchAllUsersUseCase } from '@/domain/application/use-cases/users/fetch-all-users'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { UserPresenter } from '../../presenters/user-presenter'

export const fetchAllUsersRoute: FastifyPluginAsyncZod<{
	usersRepository: UsersRepository
}> = async (server, opts) => {
	const { usersRepository } = opts

	server.get(
		'/users',
		{
			schema: {
				tags: ['Users'],
				summary: 'Fetch all users',
				response: {
					200: z.object({
						users: z
							.array(
								z.object({
									id: z.uuid(),
									name: z.string(),
									email: z.email(),
									password: z.string(),
									createdAt: z.date(),
									updatedAt: z.date(),
								})
							)
							.nullable(),
					}),
				},
			},
		},
		async (_, reply) => {
			const useCase = new FetchAllUsersUseCase(usersRepository)
			const result = await useCase.execute()

			if (isRight(result)) {
				const { users } = unwrapEither(result)

				return reply
					.status(200)
					.send({ users: users.map(UserPresenter.toHTTP) })
			}
		}
	)
}
