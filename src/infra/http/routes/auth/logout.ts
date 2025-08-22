import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '../../middlewares/auth'

export const logoutRoute: FastifyPluginAsyncZod = async server => {
	server.register(auth).post(
		'/auth/logout',
		{
			schema: {
				tags: ['Auth'],
				summary: 'Logout',
				security: [{ bearerAuth: [] }],
				response: {
					200: z.object({ message: z.string() }).describe('Logout'),
				},
			},
		},
		async (_, reply) => {
			return reply
				.status(200)
				.clearCookie('token', { path: '/' })
				.send({ message: 'Logout realizado' })
		}
	)
}
