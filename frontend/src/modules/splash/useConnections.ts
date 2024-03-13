import { defineStore } from 'pinia'
import { database } from "../../../wailsjs/go/models"

interface State {
    connections: { [key: string]: database.ConnectionDetails }
}

export const useConnectionsStore = defineStore('connections', {
    state: (): State => ({
        connections: {}
    }),
    persist: true,
    actions: {
        addConnection(con: database.ConnectionDetails) {
            this.connections[con.name] = con
        },
        removeConnection(con: database.ConnectionDetails) {
            delete this.connections[con.name]
        },
        hasConnection(name: string) {
            return "undefined" !== typeof this.connections[name]
        },
    }
})
