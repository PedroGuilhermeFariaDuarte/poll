import { FastifyReply, FastifyRequest } from "fastify"

export interface RouteMapping {
    create: (request: FastifyRequest,  response: FastifyReply) => void
    update: (request: FastifyRequest,response: FastifyReply) => void
    index: (request: FastifyRequest,response: FastifyReply) => void
    show: (request: FastifyRequest,response: FastifyReply) => void
    delete: (request: FastifyRequest,response: FastifyReply) => void    
}