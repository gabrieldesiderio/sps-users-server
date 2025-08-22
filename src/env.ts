import { z } from 'zod'

const envSchema = z.object({
	PORT: z.coerce.number().prefault(3333),
	JWT_SECRET: z.string().nonempty(),
	FRONT_END_URL: z.url(),
})

export const env = envSchema.parse(process.env)
