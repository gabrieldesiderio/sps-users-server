import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '@/env'
import { errorHandler } from './error-handler'
import { appRoutes } from './routes'

const server = fastify({ logger: true })

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler(errorHandler)

server.register(fastifyJwt, { secret: env.JWT_SECRET })
server.register(fastifyCors, { origin: '*' })

server.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'SPS Group - Users API',
			version: '1.0.0',
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	transform: jsonSchemaTransform,
})
server.register(fastifySwaggerUi, { routePrefix: '/docs' })

server.register(appRoutes)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
	console.log('HTTP server running! 🚀')
})
