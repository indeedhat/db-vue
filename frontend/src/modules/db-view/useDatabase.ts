import { useToast } from "../toast/useToast";
import * as adapter from '../../../wailsjs/go/main/Adapter'
import { database } from '../../../wailsjs/go/models'

export interface DBInfo {
    schemas: string[]
    tables: string[]
}

interface DatabaseAdapter {
    listSchemas: () => Promise<string[]>
    useSchema: (schema: string) => Promise<DBInfo|null>
    query: (query: string) => Promise<database.Results>
    truncateTable: (table: string) => Promise<DBInfo|null>
    dropTable: (table: string) => Promise<DBInfo|null>
    e: (value: any, type: database.ColumnType) => string
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
            const info: DBInfo = {schemas: [], tables: []}

            await adapter.Use(schema)
            info.tables = await adapter.ListTables()
            info.schemas = await adapter.ListSchemas()

            toast.success(`Switched to ${schema}`)
            return info
        } catch {
            toast.error(`Failed to switch to ${schema}`)
        }

        return null
    }

    const query = async (query: string): Promise<database.Results> => {
        const r = await adapter.Query(query)
        console.log({ r })
        return r
    }

    const truncateTable = async (table: string): Promise<DBInfo|null> => {
        try {
            await adapter.TruncateTable(table)
            toast.error(`Truncated table ${table}`)

            try {
                const info: DBInfo = {schemas: [], tables: []}
                info.tables = await adapter.ListTables()
                info.schemas = await adapter.ListSchemas()
                return info
            } catch {
                return null
            }
        } catch (e) {
            toast.error(`Failed to truncate table ${table}<br />Error: ${e}`)
        }

        return null
    }

    const dropTable = async (table: string): Promise<DBInfo|null> => {
        try {
            await adapter.DropTable(table)
            toast.error(`Dropped table ${table}`)

            try {
                const info: DBInfo = {schemas: [], tables: []}
                info.tables = await adapter.ListTables()
                info.schemas = await adapter.ListSchemas()
                return info
            } catch {
                return null
            }
        } catch (e) {
            toast.error(`Failed to drop table ${table}<br />Error: ${e}`)
        }

        return null
    }

    const e = (value: any, type: database.ColumnType): string => {
        console.log(type.scan_type)
        switch (type.scan_type) {
            case 'NullString':
                return value.String
        }

        return value
    }

    return {
        listSchemas,
        useSchema,
        query,
        truncateTable,
        dropTable,
        e
    }
};

export { useDatabase }
export default useDatabase
