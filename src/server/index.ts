import fastifyCookie from "@fastify/cookie";
import Fastify from "fastify";

// Routes
import { pollCreateRoute, pollDeleteRoute, pollIndexRoute, pollShowRoute, pollUpdateRoute, pollVoteRoute } from "routes/polls";

const machine = Fastify({
    caseSensitive: true,
    logger: {        
        timestamp: true
    },
})

// Register HTTP Cookies Handler
machine.register(fastifyCookie, {
    secret: 'my-secret',
    hook:'onRequest',    
})

// Register Poll Routes
machine.register(pollCreateRoute)
machine.register(pollDeleteRoute)
machine.register(pollIndexRoute)
machine.register(pollShowRoute)
machine.register(pollUpdateRoute)
machine.register(pollVoteRoute)

const serverHandler = async () => {
    try {
        await machine.listen({port: 3333})

        const address = machine.server.address()
        const port = typeof address === 'string' ? address : address?.port || -1

        machine.log.info(null, `The server in running in: ${port}`)
    } catch (error) {
        machine.log.fatal(error, "Something are wrong with server initialization")
    }
}

serverHandler()