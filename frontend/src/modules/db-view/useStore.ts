import { defineStore } from 'pinia'
import { database } from "../../../wailsjs/go/models"
import { type DBInfo } from './useDatabase'

interface State {
    activeSchema: string
    schemaTabs: { [key: string]: TabState; }
    info: DBInfo,
}

type TabState = { [key: string]: ConsoleState }

export interface ConsoleState {
    content: string
    results: database.Results|null
}

export const useStore = defineStore('db-view', {
    state: (): State => ({
        activeSchema: "",
        schemaTabs: {},
        info: {
            schemas:[],
            tables: []
        }
    }),
    persist: true,
    getters: {
        activeSchemaState(state: State): TabState|undefined {
            return state.schemaTabs[state.activeSchema]
        },
        activeTabCount(state: State): number {
            const schemaState = state.schemaTabs[state.activeSchema]
            if (!schemaState) {
                return 0
            }

            return Object.keys(schemaState).length
        }
    },
    actions: {
        setActive(schema: string) {
            this.activeSchema = schema
            if (!this.schemaTabs[this.activeSchema]) {
                this.schemaTabs[this.activeSchema] = {}
            }
        },
        addTab(table: string) {
            if (!this.schemaTabs[this.activeSchema][table]) {
                this.schemaTabs[this.activeSchema][table] = {
                    content: "",
                    results: null
                }
            }
        },
        removeTab(table: string) {
            if (!this.schemaTabs[this.activeSchema]) {
                return
            }

            if (this.schemaTabs[this.activeSchema][table]) {
                delete this.schemaTabs[this.activeSchema][table]
            }
        },
        setInfo(info: DBInfo) {
            this.info = info
        }
    }
})
