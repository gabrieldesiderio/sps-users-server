import type { FastifyInstance } from 'fastify'
import { InMemoryUsersRepository } from '@/infra/fake-database/repositories/in-memory-users-repository'
import { authenticateWithCredentialsRoute } from './auth/authenticate-with-credentials'
import { logoutRoute } from './auth/logout'
import { profileRoute } from './auth/profile'
import { createUserRoute } from './users/create-user'
import { deleteUserRoute } from './users/delete-user'
import { editUserRoute } from './users/edit-user'
import { fetchAllUsersRoute } from './users/fetch-all-users'
import { findUserByIdRoute } from './users/find-user-by-id'

const usersRepository = new InMemoryUsersRepository()

export async function appRoutes(app: FastifyInstance) {
	/**
	 * Auth routes
	 */
	app.register(authenticateWithCredentialsRoute, { usersRepository })
	app.register(logoutRoute)
	app.register(profileRoute, { usersRepository })

	/**
	 * Users routes
	 */
	app.register(createUserRoute, { usersRepository })
	app.register(editUserRoute, { usersRepository })
	app.register(fetchAllUsersRoute, { usersRepository })
	app.register(findUserByIdRoute, { usersRepository })
	app.register(deleteUserRoute, { usersRepository })
}
