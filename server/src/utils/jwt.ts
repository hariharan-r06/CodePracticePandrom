import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { User } from '../types'

export const signToken = (user: Pick<User, 'id' | 'email' | 'role'>) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN as any }
    )
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, env.JWT_SECRET) as { id: string; email: string; role: string }
}
