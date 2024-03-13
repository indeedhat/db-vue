import { defineStore } from 'pinia'
import { database } from "@/../wailsjs/go/models"

interface State {
    connection?: database.ConnectionDetails
}

export const useGlobalStore = defineStore('global-state', {
    state: (): State => ({}),
    persist: false,
    actions: {
        setConnection(con: database.ConnectionDetails) {
            this.connection = con
        }
    }
})
