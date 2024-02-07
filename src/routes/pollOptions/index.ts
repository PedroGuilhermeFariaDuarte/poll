import { FastifyInstance } from "fastify";

// Controller Modules
import { PollOptionController } from "@modules/PollOption/controllers";

const pollOptionController = new PollOptionController()

export async function pollCreateRoute(server: FastifyInstance | null = null){
    try {
        if(!server) return;

        server.post('/poll/option/create', 
        {
            schema: {
            body: {
            type: 'object',
            properties: {
                title: {
                    type: 'string'
                }
            }
            }
            }
        }, 
        pollOptionController.create)
        
    } catch (error) {
        throw error
    }
}

export async function pollUpdateRoute(server: FastifyInstance | null = null){
    try {
        if(!server) return;

        server.put('/poll/option/update/:id', {
            schema: {
                querystring: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string'
                        }
                    }
                }
            }
        },    pollOptionController.create)
        
    } catch (error) {
        throw error
    }
}

export async function pollIndexRoute(server: FastifyInstance | null = null){
    try {
        if(!server) return;

        server.get('/polls/options/all', pollOptionController.create)
        
    } catch (error) {
        throw error
    }
}

export async function pollShowRoute(server: FastifyInstance | null = null){
    try {
        if(!server) return;

        server.get('/poll/option/:id',{
            schema: {
                querystring: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string'
                        }
                    }
                }
            }
        }, pollOptionController.create)
        
    } catch (error) {
        throw error
    }
}

export async function pollDeleteRoute(server: FastifyInstance | null = null){
    try {
        if(!server) return;

        server.delete('/poll/option/delete/:id', 
        {
            schema: {
                querystring: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string'
                        }
                    }
                }
            }
        }, 
        pollOptionController.create)
        
    } catch (error) {
        throw error
    }
}