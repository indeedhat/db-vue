<template>
    <section id="console" class="p-5 dark:border-neutral-700 border-b ">
        <v-ace-editor
            v-model:value="state.content"
            @init="editorInit"
            lang="mysql"
            theme="nord_dark"
            style="height: 300px;font-size: 20px" 
        />
        <std-button @click="runQuery">Run</std-button>
    </section>
    <section id="results" class="flex overflow-auto m-5 pb-1">
        <div v-if="state.results?.error">{{ state.results.error }}</div>
        <div v-else-if="!state.results?.headers?.length">No results</div>
        <base-table v-else>
            <thead>
                <tr>
                    <headder-cell v-for="header in state.results?.headers" :key="header">{{ header }}</headder-cell>
                </tr>
            </thead>
            <table-body v-if="state.results?.rows">
                <tr v-for="(row, i) in state.results?.rows" :key="i">
                    <data-cell v-for="(data, j) in row" :key="j">
                        {{ adapter.e(data, state.results.col_types[j]) }}
                    </data-cell>
                </tr>
            </table-body>
            <table-body v-else>
                <tr>
                    <data-cell :colspan="state.results?.headers.length">
                        No results
                    </data-cell>
                </tr>
            </table-body>
        </base-table>
    </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { database } from '../../../../wailsjs/go/models'
import { useDatabase, type DBInfo } from '../useDatabase'
import { type ConsoleState } from '../useStore'

import { VAceEditor } from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-mysql'
import 'ace-builds/src-noconflict/theme-nord_dark'

import StdButton from '@/components/Button.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import TableBody from '@/components/table/TableBody.vue'
import HeadderCell from '@/components/table/HeadderCell.vue'
import DataCell from '@/components/table/DataCell.vue'

const props = defineProps<{
    state: ConsoleState
}>()

const adapter = useDatabase()

const editorInit = () => {}

const runQuery = async () => {
    props.state.results = await adapter.query(props.state.content)
}
</script>

