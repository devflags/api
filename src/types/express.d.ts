declare global {
    namespace Express {
        interface Request {
            requestId: string
            requestStartedAt: string
        }
    }
}

export {}
