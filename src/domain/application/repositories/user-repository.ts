import type { User } from '@/domain/entities/user'

export abstract class UsersRepository {
	abstract findById(id: string): Promise<User | null>
	abstract findByEmail(email: string): Promise<User | null>
	abstract fetchAll(): Promise<User[]>
	abstract save(user: User): Promise<void>
	abstract create(user: User): Promise<void>
	abstract delete(user: User): Promise<void>
}
