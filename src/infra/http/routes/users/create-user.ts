import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import type { UsersRepository } from '@/domain/application/repositories/user-repository'
import { CreateUserUseCase } from '@/domain/application/use-cases/users/create-user'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { auth } from '../../middlewares/auth'

export const createUserRoute: FastifyPluginAsyncZod<{
	usersRepository: UsersRepository
}> = async (server, opts) => {
	const { usersRepository } = opts

	server.register(auth).post(
		'/',
		{
			schema: {
				tags: ['Users'],
				summary: 'Create a new user',
				security: [{ bearerAuth: [] }],
				body: z.object({
					name: z.string().nonempty(),
					email: z.email(),
					password: z.string().nonempty(),
				}),
				response: {
					201: z.null().describe('User created'),
					409: z.object({ message: z.string() }),
				},
			},
		},
		async (request, reply) => {
			const useCase = new CreateUserUseCase(usersRepository)
			const result = await useCase.execute(request.body)

			if (isRight(result)) {
				return reply.status(201).send()
			}

			const error = unwrapEither(result)

			switch (error.constructor.name) {
				case 'ConflictError':
					return reply.status(409).send({ message: error.message })
			}
		}
	)
}
