import { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";

// Database
import { prisma } from "@database/index";

// Schemas
import Voting from "@app/queues/Voting";
import { redis } from "@database/redis";
import { SocketStream } from "@fastify/websocket";
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
                            title: true,
                            id: true,
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

            // const pollParsed: typeof polls = []
            // let asyncRunning = false
            // let index = 0

            // while(pollParsed.length < polls.length) {
            //     if(!asyncRunning) {
            //         asyncRunning = true
            //         redis.zrange(polls[index].id, 0, -1, 'WITHSCORES').then(optionsScores => {
            //             const votes = optionsScores.reduce((a,b, index) => { 
            //                 if(index % 2 === 0) {
            //                     const score = optionsScores[index+1];
            
            //                     Object.assign(a, {[b]: Number(score)})
            //                 }
            
            //                 return a
            //             }, {} as Record<string, number>)
        
            //             pollParsed.push({
            //                 ...polls[index],
            //                 options: polls[index].options.map(option =>( {
            //                     id:option.id,
            //                     title: option.title,
            //                     score: (option.id in votes) ? votes[option.id] : 0
            //                 }))
            //             })
    
            //             asyncRunning = false
            //             index++
            //         })
            //     }
            // }
            
            return polls;
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

            const pollWithOptions = await prisma.poll.findUnique({
                where: {
                    id: paramDataParsed.id
                },
                include: {
                    options: {
                        select: {
                            title: true,
                            id: true
                        },
                        orderBy: {
                            createdAt: 'asc'
                        }
                    }
                }
            })

            if(!pollWithOptions) throw new Error('Poll not found')
        
            const optionsScores = (await redis.zrange(paramDataParsed.id, 0, -1, 'WITHSCORES'))
            
            const votes = optionsScores.reduce((a,b, index) => { 
                if(index % 2 === 0) {
                    const score = optionsScores[index+1];

                    Object.assign(a, {[b]: Number(score)})
                }

                return a
            }, {} as Record<string, number>)

            return {
                ...pollWithOptions,
                options: pollWithOptions.options.map(option =>( {
                    id:option.id,
                    title: option.title,
                    score: (option.id in votes) ? votes[option.id] : 0
                }))
            }
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
                        sessionId_pollId: {
                            sessionId,
                            pollId: paramDataParsed.pollId
                        }
                    },
                    select: {
                        id: true,
                        pollOptionId: true,
                        poll : {
                            select: {
                                title: true,
                                id: true
                            }
                        },
                        option: {
                            select: {
                                title: true,
                                id: true,
                            }
                        }
                    }
                })
                    
                if(voteAlReady && voteAlReady.pollOptionId === pollDataParsed.pollOptionId) throw new Error('You vote already exists about this option');

                await prisma.vote.delete({
                    where: {
                        id: voteAlReady?.id,
                        pollOptionId: voteAlReady?.pollOptionId
                    }
                })

                if(voteAlReady?.pollOptionId) {
                    const votedAmount = await redis.zincrby(paramDataParsed.pollId, -1, voteAlReady?.pollOptionId)

                     Voting.publish(voteAlReady.poll.id, sessionId, {
                        optionTitle: voteAlReady.option.title,
                        pollOptionId: voteAlReady.option.id,
                        pollTitle: voteAlReady.poll.title,
                        votes: Number(votedAmount)
                    })
                }
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
                            title: true,
                            id: true
                        }
                    },
                    option: {
                        select: {
                            title: true,
                            id: true,
                        }
                    }
                }
            })

            if(!voteCreated) throw new Error('Something is wron on creation of The vote')

            const votedAmount = await redis.zincrby(paramDataParsed.pollId,1, pollDataParsed.pollOptionId)

            Voting.publish(voteCreated.poll.id, sessionId, {
                optionTitle: voteCreated.option.title,
                pollOptionId: voteCreated.option.id,
                pollTitle: voteCreated.poll.title,
                votes: Number(votedAmount)
            })
            
            return voteCreated;
        } catch (error) {
            throw error;
        }
    }

    async results(connection: SocketStream, request: FastifyRequest){
        try {            
            const {id}: {id: string} = request.params as any
             let {sessionId} = request.cookies

            if(!id) throw new Error('The ID of poll is invalid')

            if(!sessionId) throw new Error('Your session is invalid')

            Voting.subscriber(id, {
                sessionID:sessionId,
                callback: (message) => {
                    connection.socket.send(`Olá 👋! A enquete ${message.pollTitle}, recebeu um novo voto na opção ${message.optionTitle}. ${message.votes}`)
                }
            })
        } catch (error) {
            throw error
        }
    }
}