import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface UserProps {
	name: string
	email: string
	password: string
	type: 'admin' | 'default'
	createdAt: Date
	updatedAt?: Date
}

export class User extends Entity<UserProps> {
	get name() {
		return this.props.name
	}

	set name(name: string) {
		this.props.name = name
		this.touch()
	}

	get email() {
		return this.props.email
	}

	set email(email: string) {
		this.props.email = email
		this.touch()
	}

	get password() {
		return this.props.password
	}

	set password(password: string) {
		this.props.password = password
		this.touch()
	}

	get type() {
		return this.props.type
	}

	set type(type: 'admin' | 'default') {
		this.props.type = type
		this.touch()
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt || this.props.createdAt
	}

	private touch() {
		this.props.updatedAt = new Date()
	}

	static create(props: UserProps, id?: UniqueEntityId) {
		const user = new User(
			{
				...props,
			},
			id
		)

		return user
	}
}
