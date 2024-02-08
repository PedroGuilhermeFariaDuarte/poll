
export type TMessage = {pollTitle: string, optionTitle: string, pollOptionId: string, votes: number}

export type TSubscriber = {    
    sessionID: string
    callback: (message: TMessage) => void   
}