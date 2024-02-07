import { z } from "zod";

export const CreateSchema = z.object({
    title: z.string({
        required_error: 'The title from poll is required',
        description: 'The name from poll',
    }),
    options: z.array(z.string())
})

export const ShowSchema = z.object({
    id: z.string({
        required_error: 'The ID from poll is required',
        description: 'The ID from poll',
    }).uuid(),
})

export const VoteSchema = z.object({
    pollOptionId: z.string({
        required_error: 'The ID from option is required',
        description: 'The ID option poll',
    }).uuid(),
})

export const VoteRouteParamSchema = z.object({
    pollId: z.string({
        required_error: 'The ID from poll is required',
        description: 'The ID poll poll',
    }).uuid(),
})