// Types
import { TMessage, TSubscriber } from "./types";

class Voting {
    private channels: Record<string,TSubscriber[]> = {}
    private onPublish: boolean = false
    private onUnSubscribe: boolean = false

    subscriber(pollID: string, subscriber: TSubscriber) {
        try {
            if(!pollID || !subscriber || typeof subscriber !== 'function') throw new Error('Something its wrong to subscriber a client')

            if(!this.channels[pollID]) {
                this.channels[pollID] = [subscriber]
                return
            }
        } catch (error) {
            throw error
        }
    }

    unsubscriber(pollID: string, sessionID: string) {
        try {
            if(!pollID || !sessionID || typeof sessionID !== 'string') throw new Error('Something its wrong to unsubscriber a client')

            if(this.channels[pollID]?.find(ch => ch.sessionID !== sessionID)) return            
            
            this.channels[pollID] = this.channels[pollID].filter(ch => ch.sessionID !== sessionID)
            return            
        } catch (error) {
            throw error
        }
    }

    publish(pollID: string, sessionID: string, message: TMessage){
        try {
            if(!pollID || typeof pollID !== 'string' || !message || typeof message !== 'object') throw new Error('Something its wrong to publish an message')

            if(!this.channels[pollID]) return;

            this.onPublish = true

            for(const subscriber of this.channels[pollID]) {
                // @ts-ignore
                subscriber[pollID][sessionID].callback(message)
            }

            this.onPublish = false
        } catch (error) {
            this.onPublish = false
            throw error;
        }
    }
}


export default new Voting()