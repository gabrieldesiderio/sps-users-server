import type { User } from '@/domain/entities/user'

export class UserPresenter {
	static toHTTP(user: User) {
		return {
			id: user.id.toString(),
			name: user.name,
			email: user.email,
			password: user.password,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		}
	}
}
