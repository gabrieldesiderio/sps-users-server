import type { FastifyInstance } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'
import { UnauthorizedError } from '@/domain/application/use-cases/_errors/unauthorized'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.status(400).send({
			message: 'Validation error',
			issues: error.validation,
		})
	}

	if (error instanceof UnauthorizedError) {
		return reply.status(401).send({
			message: 'Unauthorized',
		})
	}

	console.error(error)

	return reply.status(500).send({ message: 'Internal server error.' })
}
