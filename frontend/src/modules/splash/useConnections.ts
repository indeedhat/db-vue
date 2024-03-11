import { defineStore } from 'pinia'
import { main } from "../../../wailsjs/go/models"

export interface Connection {
    type: main.ConnectionType
    name: string
    host: string
    port: string
    user: string
    pass: string
}

interface State {
    connections: { [key: string]: Connection }
}

export const useStore = defineStore('db-view', {
    state: (): State => ({
        connections: {}
    }),
    actions: {
        addConnection(con: Connection) {
            this.connections[con.name] = con
        },
        removeConnection(con: Connection) {
            delete this.connections[con.name]
        }
    }
})
