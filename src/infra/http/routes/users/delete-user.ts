import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import type { UsersRepository } from '@/domain/application/repositories/user-repository'
import { DeleteUserUseCase } from '@/domain/application/use-cases/users/delete-user'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { auth } from '../../middlewares/auth'

export const deleteUserRoute: FastifyPluginAsyncZod<{
	usersRepository: UsersRepository
}> = async (server, opts) => {
	const { usersRepository } = opts

	server.register(auth).delete(
		'/:userId',
		{
			schema: {
				tags: ['Users'],
				summary: 'Delete an user by ID',
				security: [{ bearerAuth: [] }],
				params: z.object({
					userId: z.uuid(),
				}),
				response: {
					200: z.null().describe('User deleted'),
					404: z.object({ message: z.string() }),
				},
			},
		},
		async (request, reply) => {
			const useCase = new DeleteUserUseCase(usersRepository)
			const result = await useCase.execute({ userId: request.params.userId })

			if (isRight(result)) {
				return reply.status(200).send()
			}

			const error = unwrapEither(result)

			switch (error.constructor.name) {
				case 'NotFoundError':
					return reply.status(404).send({ message: error.message })
			}
		}
	)
}
