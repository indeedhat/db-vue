<template>
    <header class="dark:border-neutral-700 border-b dark:bg-neutral-800 p-4">
        <page-title>DB Vue</page-title>
    </header>
    <section id="layout" class="flex flex-grow overflow-hidden overscroll-contain text-neutral-700 dark:text-neutral-200">
        <aside class="flex flex-col dark:border-neutral-700 border-r dark:bg-neutral-800">
            <ul>
                <menu-select :items="store.info.schemas" 
                    :active="store.activeSchema" 
                    :onSelect="(schema: string) => useDb(schema)" 
                />
            </ul>
            <ul v-if="store.info.tables.length" class="flex-grow overflow-auto">
                <menu-item  v-for="table in [...store.info.tables].sort()" 
                    :key="table" 
                    @click.left="openTab(table)"
                    @click.right.prevent="(e) => openContext(e, table)"
                >
                    {{ table }}
                </menu-item>
            </ul>
            <div v-else>No Tables</div>
        </aside>
        <main class="relative flex flex-col flex-grow min-h-0 max-h-full overflow-y-auto">
            <context-menu ref="contextMenu">
                <context-item @click="openTab(contextTable)">Open</context-item>
                <context-seperator />
                <context-item v-for="command in tableCommands"
                    :key="command"
                    @click="() => runTableCommand(command)"
                >
                    {{ command }}
                </context-item>
            </context-menu>
            <tab-container ref="tabs">
                <tab v-for="(consoleState, tname) in store.activeSchemaState" 
                    :key="tname" 
                    :name="<string>tname" 
                    :onRemove="() => removeTab(<string>tname)"
                >
                    <console-page :state="consoleState"/>
                </tab>
            </tab-container>
            <notice v-if="store.activeTabCount == 0">Select a table on the left to continue</notice>
        </main>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { database } from '../../../wailsjs/go/models'
import { useDatabase, type DBInfo } from './useDatabase'
import { useStore } from './useStore'
import { useGlobalStore } from '../useGlobalStore'

import PageTitle from '@/components/Title.vue'
import ContextMenu, { type ContextMenuType } from '@/components/context-menu/ContextMenu.vue'
import ContextItem from '@/components/context-menu/ContextItem.vue'
import ContextSeperator from '@/components/context-menu/ContextSeperator.vue'
import ConsolePage from '@/modules/db-view/components/ConsolePage.vue'
import MenuSelect from '@/modules/db-view/components/MenuSelect.vue'
import MenuItem from '@/modules/db-view/components/MenuItem.vue'
import Tab from '@/components/tabs/Tab.vue'
import TabContainer, { type TabContainerModel } from '@/components/tabs/TabContainer.vue'
import Notice from '@/components/Notice.vue'

const adapter = useDatabase()
const globalStore = useGlobalStore()
const store = useStore(globalStore.connection!.name)

const tabs = ref<TabContainerModel>()
const tableCommands = ref<string[]>([])
const contextTable = ref<string>("")
const contextMenu = ref<ContextMenuType>()

const openContext = (e: MouseEvent, table: string) => {
    contextTable.value = table
    contextMenu.value?.open(e.screenX, e.screenY)
}
const runTableCommand = async (command: string) => {
    contextMenu.value?.close()

    await adapter.runTableCommand(contextTable.value, command)
    const info = await adapter.refreshInfo()
    if (info) {
        store.setInfo(info!)
    }
}
const removeTab = (tab: string): void => store.removeTab(tab)
const openTab = (tab: string): void => {
    contextMenu.value?.close()
    if (!store.hasTab(tab)) {
        store.addTab(tab)
    }

    tabs.value?.setActive(tab)
}
const useDb = async (name: string): Promise<void> => {
    const inf = await adapter.useSchema(name)
    if (!inf) {
        return
    }
    store.setActive(name)
    store.setInfo(inf!)
}

onMounted(async (): Promise<any> => {
    // TODO: should probably to some kind of retry here
    const schemas = await adapter.listSchemas()
    if (!schemas.length) {
        return
    }

    if (!store.activeSchema) {
        store.setActive(schemas[0])
    }
    const inf = await adapter.useSchema(store.activeSchema)
    if (inf) {
        store.setInfo(inf!)
    }

    tableCommands.value = await adapter.tableCommands()
})
</script>

<style scoped>
aside {
    min-width: 200px;
    max-width: 33%;
}
</style>
