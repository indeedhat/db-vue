<template>
    <div class="p-4">
        <std-button @click="() => showForm = true">Add Connection</std-button>
    </div>
    <div v-if="showForm">
        <div id="form" class="grid gap-2">
            <std-select>
                <option :value="main.ConnectionType.MySQL">
                    {{ main.ConnectionType.MySQL }}
                </option>
                <option :value="main.ConnectionType.Postgres">
                    {{ main.ConnectionType.Postgres }}
                </option>
            </std-select>
            <std-input label="name" />
            <std-input label="host" />
            <std-input label="port" />
            <std-input label="user" />
            <std-input label="pass" type="password" />
            <div class="flex justify-between">
                <std-button @click="() => showForm = false">Cancel</std-button>
                <std-button>Save</std-button>
            </div>
        </div>
    </div>
    <div id="connection-grid" class="grid gap-4 p-4">
        <connection-widget v-for="i in 5" :key="i" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import ConnectionWidget from './components/ConnectionWidget.vue'
import StdButton from '../../components/Button.vue'
import StdInput from '../../components/form/Input.vue'
import StdSelect from '../../components/form/Select.vue'
import { main } from '../../../wailsjs/go/models'

const showForm = ref(false)
</script>

<style scoped>
#connection-grid {
    grid-template-columns: repeat(auto-fill, 300px);
}
#form {
    max-width:600px;
    margin: 0 auto;
    margin-bottom: 50px;
}
</style>
