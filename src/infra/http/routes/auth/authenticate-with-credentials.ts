import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import type { UsersRepository } from '@/domain/application/repositories/user-repository'
import { SignInWithCredentialsUseCase } from '@/domain/application/use-cases/auth/sign-in-with-credentials'
import { isRight, unwrapEither } from '@/infra/shared/either'

export const authenticateWithCredentialsRoute: FastifyPluginAsyncZod<{
	usersRepository: UsersRepository
}> = async (server, opts) => {
	const { usersRepository } = opts

	server.post(
		'/auth/login',
		{
			schema: {
				tags: ['Auth'],
				summary: 'Authenticate with credentials',
				body: z.object({
					email: z.email(),
					password: z.string().nonempty(),
				}),
				response: {
					200: z.object({ token: z.string() }).describe('Sign in successful'),
					400: z.object({ message: z.string() }),
				},
			},
		},
		async (request, reply) => {
			const useCase = new SignInWithCredentialsUseCase(usersRepository)
			const result = await useCase.execute(request.body)

			if (isRight(result)) {
				const { user } = unwrapEither(result)

				const token = await reply.jwtSign(
					{ sub: user.id.toString() },
					{ sign: { expiresIn: '7d' } }
				)

				return reply.status(200).send({ token })
			}

			return reply.status(400).send({ message: 'Credenciais inválidas' })
		}
	)
}
