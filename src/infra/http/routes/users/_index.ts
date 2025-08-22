import type { FastifyInstance } from 'fastify'
import { InMemoryUsersRepository } from '@/infra/fake-database/repositories/in-memory-users-repository'
import { createUserRoute } from './create-user'
import { deleteUserRoute } from './delete-user'
import { editUserRoute } from './edit-user'
import { fetchAllUsersRoute } from './fetch-all-users'

const usersRepository = new InMemoryUsersRepository()

export async function usersModule(app: FastifyInstance) {
	app.register(createUserRoute, { usersRepository })
	app.register(editUserRoute, { usersRepository })
	app.register(fetchAllUsersRoute, { usersRepository })
	app.register(deleteUserRoute, { usersRepository })
}
