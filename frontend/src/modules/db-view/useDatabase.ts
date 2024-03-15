import { useToast } from "../toast/useToast";
import * as adapter from '../../../wailsjs/go/main/App'
import { database } from '../../../wailsjs/go/models'
import { type Dict } from '@/types'

export interface DBInfo {
    schemas: string[]
    tables: string[]
}

interface DatabaseAdapter {
    listSchemas: () => Promise<string[]>
    useSchema: (schema: string) => Promise<DBInfo|null>
    refreshInfo: () => Promise<DBInfo|null>
    query: (query: string) => Promise<database.Results>
    tableCommands: () => Promise<string[]>
    runTableCommand: (table: string, command: string) => Promise<void>
    e: (value: any, type: database.ColumnType) => string
    rowJson: (results: database.Results, row: number) => string
}

const useDatabase = (): DatabaseAdapter  => {
    const toast = useToast();

    const listSchemas = async (): Promise<string[]> => {
        try {
            return await adapter.ListSchemas()
        } catch (e: any) {
            toast.error("here1", e)
            return []
        }
    }

    const useSchema = async (schema: string): Promise<DBInfo|null> => {
        try {
            await adapter.Use(schema)
            const info = refreshInfo()
            if (!info) {
                throw ""
            }

            toast.success(`Switched to ${schema}`)
            return info
        } catch {
            toast.error(`Failed to switch to ${schema}`)
        }

        return null
    }

    const refreshInfo = async (): Promise<DBInfo|null> => {
        try {
            const info: DBInfo = {
                schemas: await adapter.ListSchemas(), 
                tables: await adapter.ListTables()
            }

            return info
        } catch {
            return null
        }
    }

    const query = async (query: string): Promise<database.Results> => {
        const r = await adapter.Query(query)
        return r
    }

    const tableCommands = async (): Promise<string[]> =>  {
        try {
            return await adapter.TableCommands()
        } catch (e) {
            toast.error(`failed to list table commands`)
            return []
        }
    }

    const runTableCommand = async (table: string, command: string): Promise<void> =>  {
        try {
            await adapter.RunTableCommand(table, command)
            toast.success(`${command}: success`)
        } catch (e) {
            toast.error(`${command}: failed\n${e}`)
        }
    }

    const e = (value: any, type: database.ColumnType): string => {
        switch (type.scan_type) {
            case 'NullString':
                return value.String
        }

        return value
    }

    const rowJson = (results: database.Results, row: number): string => {
        const data: Dict<any> = {}

        for (let i = 0; i < results.headers.length; i++) {
            data[results.headers[i]] = e(results.rows[row][i], results.col_types[i])
        }

        return JSON.stringify(data, null, 4)
    }

    return {
        listSchemas,
        useSchema,
        query,
        tableCommands,
        runTableCommand,
        refreshInfo,
        e,
        rowJson
    }
};

export { useDatabase }
export default useDatabase
