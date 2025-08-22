import type { FastifyInstance } from 'fastify'
import { InMemoryUsersRepository } from '@/infra/fake-database/repositories/in-memory-users-repository'
import { authenticateWithCredentialsRoute } from './auth/authenticate-with-credentials'
import { createUserRoute } from './users/create-user'
import { deleteUserRoute } from './users/delete-user'
import { editUserRoute } from './users/edit-user'
import { fetchAllUsersRoute } from './users/fetch-all-users'

const usersRepository = new InMemoryUsersRepository()

export async function appRoutes(app: FastifyInstance) {
	/**
	 * Auth routes
	 */
	app.register(authenticateWithCredentialsRoute, { usersRepository })

	/**
	 * Users routes
	 */
	app.register(createUserRoute, { usersRepository })
	app.register(editUserRoute, { usersRepository })
	app.register(fetchAllUsersRoute, { usersRepository })
	app.register(deleteUserRoute, { usersRepository })
}
