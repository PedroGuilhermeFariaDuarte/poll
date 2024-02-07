import { FastifyRequest } from "fastify"

// Database
import { prisma } from "@database/index";

export class PollOptionService {
    constructor(){
        // do anything
    }
    
    async create(request: FastifyRequest){
        try {        
            console.table(request.body)
        } catch (error) {
            throw error
        }
    }

    async update(request: FastifyRequest){
        try {        
            console.table(request.body)
        } catch (error) {
            throw error
        }
    }

    async index(request: FastifyRequest){
        try {        
            console.table(request.body)
        } catch (error) {
            throw error
        }
    }

    async show(request: FastifyRequest){
        try {        
            console.table(request.body)
        } catch (error) {
            throw error
        }
    }

    async delete(request: FastifyRequest){
        try {        
            console.table(request.body)
        } catch (error) {
            throw error
        }
    }
}