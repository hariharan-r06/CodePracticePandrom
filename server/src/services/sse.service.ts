import { Response } from 'express'

interface Client {
    id: string
    role: string
    res: Response
}

class SSEService {
    private clients: Map<string, Client> = new Map()

    addClient(userId: string, role: string, res: Response) {
        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')
        res.flushHeaders()

        this.clients.set(userId, { id: userId, role, res })

        // Heartbeat
        const interval = setInterval(() => {
            res.write(': ping\n\n')
        }, 30000)

        res.on('close', () => {
            clearInterval(interval)
            this.removeClient(userId)
        })

        this.sendToUser(userId, { type: 'connected' })
    }

    removeClient(userId: string) {
        this.clients.delete(userId)
    }

    sendToUser(userId: string, data: any) {
        const client = this.clients.get(userId)
        if (client) {
            client.res.write(`data: ${JSON.stringify(data)}\n\n`)
        }
    }

    sendToRole(role: string, data: any) {
        this.clients.forEach(client => {
            if (role === 'all' || client.role === role) {
                client.res.write(`data: ${JSON.stringify(data)}\n\n`)
            }
        })
    }

    sendToAll(data: any) {
        this.clients.forEach(client => {
            client.res.write(`data: ${JSON.stringify(data)}\n\n`)
        })
    }
}

export const sseService = new SSEService()
