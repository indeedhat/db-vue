<template>
    <header class="dark:border-neutral-700 border-b dark:bg-neutral-800">
        <h1>DB Vue</h1>
    </header>
    <section id="layout" class="flex flex-grow overflow-hidden overscroll-contain text-neutral-700 dark:text-neutral-200">
        <aside class="flex flex-col dark:border-neutral-700 border-r dark:bg-neutral-800">
            <ul>
                <menu-select :items="store.info.schemas" :active="store.activeSchema" :onSelect="(schema: string) => useDb(schema)" />
            </ul>
            <ul v-if="store.info.tables.length" class="flex-grow overflow-auto">
                <menu-item  v-for="table in [...store.info.tables].sort()" :key="table" @click="openTab(table)">
                    {{ table }}
                </menu-item>
            </ul>
            <div v-else>No Tables</div>
        </aside>
        <main class="flex-grow min-h-0 max-h-full overflow-y-auto">
            <tab-container>
                <tab v-for="(consoleState, tab) in store.activeSchemaState" :key="tab" :name="tab" :onRemove="() => removeTab(tab+'')">
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

import ConsolePage from '@/modules/db-view/components/ConsolePage.vue'
import MenuSelect from '@/modules/db-view/components/MenuSelect.vue'
import MenuItem from '@/modules/db-view/components/MenuItem.vue'
import Tab from '@/components/tabs/Tab.vue'
import TabContainer from '@/components/tabs/TabContainer.vue'
import Notice from '@/components/Notice.vue'

const adapter = useDatabase()
const store = useStore()

const removeTab = (tab: string): void => store.removeTab(tab)
const openTab = (tab: string): void => store.addTab(tab)
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
    console.log("here")
    const schemas = await adapter.listSchemas()
    console.log(schemas)
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
})
</script>

<style scoped>
aside {
    min-width: 200px;
    max-width: 33%;
}
</style>
