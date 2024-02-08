import { FastifyReply, FastifyRequest } from "fastify";


// Types
import { IBaseHTTPMethods } from "@app/types";

// Services
import { PollService } from "@app/modules/Poll/services";
import { SocketStream } from "@fastify/websocket";
import { ZodError } from "zod";

export class PollController implements IBaseHTTPMethods {
    #service: PollService;

    constructor() {
        this.#service = new PollService()
    }

    async create(request: FastifyRequest, response: FastifyReply){
        try {
            const dataService = await this.#service.create(request)

            if(!dataService) throw new Error('The data service its not available')

            response.status(201).send(dataService)
        } catch (error:any){
            const errorMessage = error instanceof ZodError ? error.message : error?.message
            
            response.status(501).send({
                status: 501,
                message: errorMessage || 'Something are wrong, try again',
                data: error
            })
        }
    }

    async update(request: FastifyRequest, response: FastifyReply){
        try {        
            console.table(request.body)
        } catch (error) {
            throw error
        }
    }

    async index(request: FastifyRequest, response: FastifyReply){
         try {
            const dataService = await this.#service.index(request)

            if(!dataService) throw new Error('The data service its not available')

            response.status(200).send(dataService)
        } catch (error:any){
           const errorMessage = error instanceof ZodError ? error.message : error?.message
            
            response.status(501).send({
                status: 501,
                message: errorMessage || 'Something are wrong, try again',
                data: error
            })
        }
    }

    async show(request: FastifyRequest, response: FastifyReply){
       try {
            const dataService = await this.#service.show(request)

            if(!dataService) throw new Error('The data service its not available')

            response.status(200).send(dataService)
        } catch (error:any){
           const errorMessage = error instanceof ZodError ? error.message : error?.message
            
            response.status(501).send({
                status: 501,
                message: errorMessage || 'Something are wrong, try again',
                data: error
            })
        }
    }

    async delete(request: FastifyRequest, response: FastifyReply){
        try {
            console.table(request.body)
        } catch (error) {
            throw error
        }
    }

    async vote(request: FastifyRequest, response: FastifyReply){
        try {
            const dataService = await this.#service.vote(request,response)

            if(!dataService) throw new Error('The data service its not available')

            response.status(201).send(dataService)
        } catch (error:any){
            const errorMessage = error instanceof ZodError ? error.message : error?.message
            
            response.status(501).send({
                status: 501,
                message: errorMessage || 'Something are wrong, try again',
                data: error
            })
        }
    }

    async results(connection: SocketStream, request: FastifyRequest){
        try {
            this.#service.results(connection,request)
        } catch (error) {
            throw error
        }
    }
} 