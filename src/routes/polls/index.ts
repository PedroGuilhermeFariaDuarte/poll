import { FastifyInstance } from "fastify";

// Controller Modules
import { PollController } from "@modules/Poll/controllers";

const pollController = new PollController()

export async function pollCreateRoute(server: FastifyInstance | null = null){
    try {
        if(!server) return;

        server.post('/polls/create', 
        {
            schema: {
                body: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string'
                        },
                        options: {
                            type: "array"
                        }
                    }
                }
            }
        }, 
        (...rest) => pollController.create.apply(pollController, rest))
        
    } catch (error) {
        throw error
    }
}

export async function pollUpdateRoute(server: FastifyInstance | null = null){
    try {
        if(!server) return;

        server.put('/polls/update/:id', {
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
        },    pollController.create)
        
    } catch (error) {
        throw error
    }
}

export async function pollIndexRoute(server: FastifyInstance | null = null){
    try {
        if(!server) return;

        server.get('/polls/all', (...rest) => pollController.index.apply(pollController,rest))
        
    } catch (error) {
        throw error
    }
}

export async function pollShowRoute(server: FastifyInstance | null = null){
    try {
        if(!server) return;

        server.get('/poll/show/:id',{
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
        }, (...rest) => pollController.show.apply(pollController, rest))
        
    } catch (error) {
        throw error
    }
}

export async function pollDeleteRoute(server: FastifyInstance | null = null){
    try {
        if(!server) return;

        server.delete('/polls/delete/:id', 
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
        pollController.create)
        
    } catch (error) {
        throw error
    }
}

export async function pollVoteRoute(server: FastifyInstance | null = null){
    try {
        if(!server) return;

        server.post('/poll/:pollId/votes', 
        {
            schema: {
                body: {
                    type: 'object',
                    properties: {
                        pollOptionId: {
                            type: 'string'
                        }
                    }
                },
                querystring: {
                    type: 'object',
                    properties: {
                        pollId: {
                            type: 'string'
                        }
                    }
                }
            }
        }, 
        (...rest) => pollController.vote.apply(pollController, rest))
        
    } catch (error) {
        throw error
    }
}