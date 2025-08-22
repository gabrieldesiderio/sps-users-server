import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import type { UsersRepository } from '@/domain/application/repositories/user-repository'
import { FindUserByIdUseCase } from '@/domain/application/use-cases/users/find-user-by-id'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { auth } from '../../middlewares/auth'
import { UserPresenter } from '../../presenters/user-presenter'

export const profileRoute: FastifyPluginAsyncZod<{
	usersRepository: UsersRepository
}> = async (server, opts) => {
	const { usersRepository } = opts

	server.register(auth).get(
		'/me',
		{
			schema: {
				tags: ['Auth'],
				summary: 'Get profile by authenticated user',
				security: [{ bearerAuth: [] }],
				response: {
					200: z.object({
						user: z.object({
							id: z.uuid(),
							name: z.string(),
							email: z.email(),
							password: z.string(),
							type: z.enum(['admin', 'default']),
							createdAt: z.date(),
							updatedAt: z.date(),
						}),
					}),
					404: z.object({ message: z.string() }),
				},
			},
		},
		async (request, reply) => {
			const userId = await request.getCurrentUserId()
			const useCase = new FindUserByIdUseCase(usersRepository)
			const result = await useCase.execute({ userId: userId })

			if (isRight(result)) {
				const { user } = unwrapEither(result)

				return reply.status(200).send({ user: UserPresenter.toHTTP(user) })
			}

			const error = unwrapEither(result)

			switch (error.constructor.name) {
				case 'NotFoundError':
					return reply.status(404).send({ message: error.message })
			}
		}
	)
}
