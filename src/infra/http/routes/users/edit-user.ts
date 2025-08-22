import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import type { UsersRepository } from '@/domain/application/repositories/user-repository'
import { EditUserUseCase } from '@/domain/application/use-cases/users/edit-user'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { auth } from '../../middlewares/auth'

export const editUserRoute: FastifyPluginAsyncZod<{
	usersRepository: UsersRepository
}> = async (server, opts) => {
	const { usersRepository } = opts

	server.register(auth).put(
		'/users/:userId',
		{
			schema: {
				tags: ['Users'],
				summary: 'Edit an user',
				security: [{ bearerAuth: [] }],
				params: z.object({
					userId: z.uuid(),
				}),
				body: z.object({
					name: z.string().nonempty(),
					email: z.email(),
					password: z.string().nonempty(),
				}),
				response: {
					200: z.null().describe('User updated'),
					404: z.object({ message: z.string() }),
					409: z.object({ message: z.string() }),
				},
			},
		},
		async (request, reply) => {
			const useCase = new EditUserUseCase(usersRepository)
			const result = await useCase.execute({
				...request.body,
				userId: request.params.userId,
			})

			if (isRight(result)) {
				return reply.status(200).send()
			}

			const error = unwrapEither(result)

			switch (error.constructor.name) {
				case 'NotFoundError':
					return reply.status(404).send({ message: error.message })
				case 'ConflictError':
					return reply.status(409).send({ message: error.message })
			}
		}
	)
}
