import { FastifyReply, FastifyRequest } from "fastify";

// Types
import { IBaseHTTPMethods } from "@app/types";

// Services
import { PollOptionService } from "@app/modules/PollOption/services";

export class PollOptionController implements IBaseHTTPMethods {
    #service: PollOptionService;

    constructor() {
        this.#service = new PollOptionService()
    }

    async create(request: FastifyRequest, response: FastifyReply){
        try {
            const dataService = await this.#service.create(request)

            if(!dataService) throw new Error('The data service its not available')

            response.status(201).send(dataService)
        } catch (error:any){
            response.status(501).send({
                status: 501,
                message: error?.message || 'Something are wrong, try again',
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
            console.table(request.body)
        } catch (error) {
            throw error
        }
    }

    async show(request: FastifyRequest, response: FastifyReply){
        try {
            console.table(request.body)
        } catch (error) {
            throw error
        }
    }

    async delete(request: FastifyRequest, response: FastifyReply){
        try {
            console.table(request.body)
        } catch (error) {
            throw error
        }
    }
} 