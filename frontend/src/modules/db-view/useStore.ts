import { defineStore } from 'pinia'
import { database } from "../../../wailsjs/go/models"
import { type DBInfo } from './useDatabase'

interface State {
    activeSchema: string
    connections: ConnectionsState
    info: DBInfo,
}
interface ConnectionsState { [key: string]: SchemasState }
interface SchemasState { [key: string]: TabsState }
interface TabsState { [key: string]: ConsoleState }
export interface ConsoleState {
    content: string
    results: database.Results|null
}

let active: string = ""
const actualUseStore = defineStore('db-view', {
    state: (): State => ({
        activeSchema: "",
        connections: {
            [active]: {}
        },
        info: {
            schemas:[],
            tables: []
        }
    }),
    persist: true,
    getters: {
        activeSchemaState(state: State): TabsState|undefined {
            return state.connections[active][state.activeSchema]
        },
        activeTabCount(state: State): number {
            if (!this.activeSchemaState) {
                return 0
            }

            return Object.keys(this.activeSchemaState).length
        }
    },
    actions: {
        setActive(schema: string) {
            this.activeSchema = schema
            if (!this.connections[schema]) {
                this.connections[schema] = {}
            }
            if (!this.activeSchemaState) {
                this.connections[active][this.activeSchema] = {}
            }
        },
        addTab(tab: string) {
            if (!this.activeSchemaState![tab]) {
                this.connections[active][this.activeSchema][tab] = {
                    content: "",
                    results: null
                }
            }
        },
        hasTab(tab: string) {
            return !!this.activeSchemaState![tab]
        },
        removeTab(tab: string) {
            if (!this.activeSchemaState![tab]) {
                return
            }

            if (this.activeSchemaState![tab]) {
                delete this.connections[active][this.activeSchema][tab]
            }
        },
        setInfo(info: DBInfo) {
            this.info = info
        }
    }
})

export const useStore = (activeConnection: string) => {
    active = activeConnection
    return actualUseStore()
}
