import { env } from './config/env'
import app from './app'

const server = app.listen(env.PORT, () => {
    console.log(`🚀 CodePractice API running on http://localhost:${env.PORT}`)
    console.log(`📊 Environment: ${env.NODE_ENV}`)
})

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...')
    server.close(() => {
        console.log('Server closed')
        process.exit(0)
    })
})

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...')
    server.close(() => {
        console.log('Server closed')
        process.exit(0)
    })
})

export default server
