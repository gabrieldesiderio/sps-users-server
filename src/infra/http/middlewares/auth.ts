import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { UnauthorizedError } from '@/domain/application/use-cases/_errors/unauthorized'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
	app.addHook('preHandler', async request => {
		request.getCurrentUserId = async () => {
			try {
				const { sub } = await request.jwtVerify<{ sub: string }>()

				return sub
			} catch {
				throw new UnauthorizedError()
			}
		}
	})

	app.addHook('onRequest', async request => {
		try {
			await request.jwtVerify()
		} catch {
			throw new UnauthorizedError()
		}
	})
})
