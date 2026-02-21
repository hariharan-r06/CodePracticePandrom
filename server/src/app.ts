import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env'
import { errorHandler } from './middleware/errorHandler'

// Routes
import authRoutes from './routes/auth.routes'
import patternRoutes from './routes/patterns.routes'
import problemRoutes from './routes/problems.routes'
import submissionRoutes from './routes/submissions.routes'
import notificationRoutes from './routes/notifications.routes'
import leaderboardRoutes from './routes/leaderboard.routes'
import profileRoutes from './routes/profile.routes'

const app = express()

// Global Middleware
app.use(helmet())
app.use(cors({ origin: env.ALLOWED_ORIGINS, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Health Check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Mount Routes
app.use('/api/auth', authRoutes)
app.use('/api/patterns', patternRoutes)
app.use('/api/problems', problemRoutes)
app.use('/api/submissions', submissionRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/profile', profileRoutes)

// Error Handling
app.use(errorHandler)

export default app
