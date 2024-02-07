import { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";

// Database
import { prisma } from "@database/index";

// Schemas
import { CreateSchema, ShowSchema, VoteRouteParamSchema, VoteSchema } from "../schemas";

export class PollService {    
    
    constructor(){
        // do anything
    }
    
    async create(request: FastifyRequest){
        try {        
            const optionDataRaw = request.body;
        
            if(!optionDataRaw) throw new Error('No data available');

            const optionDataParsed = await CreateSchema.parseAsync(optionDataRaw);

            if(!optionDataParsed) throw new Error('The data is not valid');

            const optionCreated = await prisma.poll.create({
                data: {
                    title: optionDataParsed.title,
                    options: {
                        createMany: {
                            data: optionDataParsed.options?.map(option => ({
                                title: option,
                            })) || []
                        }
                    }
                }                
            });

            if(!optionCreated) throw new Error('Something is wron on creation of The poll')

            return optionCreated
        } catch (error) {
            throw error;
        }
    }

    async update(request: FastifyRequest){
        try {        
            console.table(request.body)
        } catch (error) {
            throw error
        }
    }

    async index(_request: FastifyRequest){
         try {
            const polls = await prisma.poll.findMany({
                include: {
                    options: {
                        select: {
                            title: true
                        },
                        orderBy: {
                            createdAt: 'asc'
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                }
            })

            if(!polls) throw new Error('')
            
            return polls
        } catch (error) {
            throw error;
        }
    }

    async show(request: FastifyRequest){
       try {        
            const routeParams: {id: string} = request.params as unknown as any;            

            if(!routeParams || !routeParams?.id) throw new Error('No data available');

            if(typeof routeParams.id !== 'string') throw new Error('The ID its wrong');
                                    
            const paramDataParsed = await ShowSchema.parseAsync(routeParams);

            if(!paramDataParsed) throw new Error('The data is not valid');

            const option = await prisma.poll.findUnique({
                where: {
                    id: paramDataParsed.id
                },
                include: {
                    options: {
                        select: {
                            title: true
                        },
                        orderBy: {
                            createdAt: 'asc'
                        }
                    }
                }
            })

            if(!option) throw new Error('')
            

            return option
        } catch (error) {
            throw error;
        }
    }

    async delete(request: FastifyRequest){
        try {        
            console.table(request.body)
        } catch (error) {
            throw error
        }
    }

     async vote(request: FastifyRequest, response: FastifyReply){
        try {        
            const pollDataRaw = request.body;
        
            if(!pollDataRaw) throw new Error('No data available');

            const pollDataParsed = await VoteSchema.parseAsync(pollDataRaw);

            if(!pollDataParsed) throw new Error('The data is not valid');

            const routeParams: { pollId: string } = request.params as unknown as any;

            if(!routeParams || !routeParams?.pollId) throw new Error('No data available');

            if(typeof routeParams.pollId !== 'string') throw new Error('The ID its wrong');

            const paramDataParsed = await VoteRouteParamSchema.parseAsync(routeParams);

            if(!paramDataParsed) throw new Error('The data is not valid');
            
            let {sessionId} = request.cookies

            if(sessionId) {
                const voteAlReady = await prisma.vote.findUnique({
                    where: {
                        sessionId,
                        pollId: paramDataParsed.pollId,                        
                    },
                    select: {
                        id: true,
                        pollOptionId: true
                    }
                })
                    
                if(voteAlReady && voteAlReady.pollOptionId === pollDataParsed.pollOptionId) throw new Error('You vote already exists about this option');

                await prisma.vote.delete({
                    where: {
                        id: voteAlReady?.id,
                        pollOptionId: voteAlReady?.pollOptionId
                    }
                })
            }

            if(!sessionId) {
                sessionId = randomUUID()
    
                response.setCookie('sessionID', sessionId, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 30, // 30 days,
                    signed: true,
                    httpOnly: true
                })
            }        

            const voteCreated = await prisma.vote.create({
                data: {
                    sessionId,
                    pollId: paramDataParsed.pollId,
                    pollOptionId: pollDataParsed.pollOptionId
                },
                select: {
                    id: true,
                    poll : {
                        select: {
                            title: true
                        }
                    },
                    option: {
                        select: {
                            title: true
                        }
                    }
                }
            })

            if(!voteCreated) throw new Error('Something is wron on creation of The vote')

            return voteCreated;
        } catch (error) {
            throw error;
        }
    }
}