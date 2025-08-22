import type { UsersRepository } from '@/domain/application/repositories/user-repository'
import { User } from '@/domain/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
	protected seeds = User.create({
		name: 'Admin',
		email: 'admin@sps.com',
		password: 'admin123',
		type: 'admin',
		createdAt: new Date(),
	})

	public items: User[] = [this.seeds]

	async findById(id: string) {
		const user = this.items.find(item => item.id.toString() === id)

		if (!user) {
			return null
		}

		return user
	}

	async findByEmail(email: string) {
		const user = this.items.find(item => item.email === email)

		if (!user) {
			return null
		}

		return user
	}

	async fetchAll() {
		const users = this.items.sort(
			(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
		)

		return users
	}

	async save(user: User) {
		const itemIndex = this.items.findIndex(item => item.id === user.id)

		this.items[itemIndex] = user
	}

	async create(user: User) {
		this.items.push(user)
	}

	async delete(user: User) {
		const itemIndex = this.items.findIndex(item => item.id === user.id)

		this.items.splice(itemIndex, 1)
	}
}
