export class ConflictError extends Error {
	constructor(message?: string) {
		super(message || 'O recurso já existe.')
	}
}
