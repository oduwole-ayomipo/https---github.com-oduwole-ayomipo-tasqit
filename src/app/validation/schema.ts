import { z } from 'zod'

export const SignupShema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must not exceed 20 characters'),
  email: z.string({ required_error: 'Email is required' }).email(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
      `Password must contain at least one digit,
            one lowercase letter,
            one uppercase letter,
            one special character,
            and be 8-30 characters long`
    )
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export const PasswordResetSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
      `Password must contain at least one digit,
            one lowercase letter,
            one uppercase letter,
            one special character,
            and be 8-30 characters long`
    )
})

export const UserProfileSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  created_at: z.string(),
  last_login_at: z.string()
})

export const PayloadSchema = z.object({
  user: z.array(UserProfileSchema),
  iat: z.number(),
  exp: z.number()
})
