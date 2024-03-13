<template>
    <div class="p-4">
        <std-button @click="() => showForm = true">Add Connection</std-button>
    </div>
    <div v-if="showForm">
        <div id="form" class="grid gap-2">
            <std-select v-model="formData.type" label="Database Type">
                <option :value="database.ConnectionType.MySQL">
                    {{ database.ConnectionType.MySQL }}
                </option>
                <option :value="database.ConnectionType.Postgres">
                    {{ database.ConnectionType.Postgres }}
                </option>
            </std-select>
            <std-input label="name" v-model="formData.name" />
            <std-input label="host" v-model="formData.host" />
            <std-input label="port" type="number" v-model="formData.port" />
            <std-input label="user" v-model="formData.user" />
        <std-input label="pass" type="password" v-model="formData.pass" />
        <div class="flex justify-between">
                <std-button @click="() => showForm = false">Cancel</std-button>
                <std-button @click="handleSubmit">Save</std-button>
            </div>
        </div>
    </div>
    <div id="connection-grid" class="grid gap-4 p-4">
        <connection-widget v-for="(con, i) in store.connections" 
            :key="i" 
            :details="con" 
            @click="() => handleConnect(con)" 
        />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { Connect } from '../../../wailsjs/go/main/App'
import { database } from '../../../wailsjs/go/models'
import { useConnectionsStore } from './useConnections'
import { useGlobalStore } from '../useGlobalStore'
import { useToast } from '../toast/useToast'

import ConnectionWidget from './components/ConnectionWidget.vue'
import StdButton from '../../components/Button.vue'
import StdInput from '../../components/form/Input.vue'
import StdSelect from '../../components/form/Select.vue'

const router = useRouter()
const toast = useToast()
const showForm = ref<Boolean>()
const formData = ref({
    type: '',
    name: '',
    host: '',
    port: 0,
    user: '',
    pass: ''
})
const store = useConnectionsStore()
const globalStore = useGlobalStore()

const handleSubmit = () => {
    if (!formData.value.type
        || !formData.value.name 
        || !formData.value.host
        || !formData.value.port
        || !formData.value.user
        || !formData.value.pass
    ) {
        toast.error("Fill out all the form fields")
        return
    } else if (store.hasConnection(formData.value.name)) {
        toast.error("name in use")
        return
    }

    store.addConnection(database.ConnectionDetails.createFrom({
        type: formData.value.type,
        name: formData.value.name,
        host: formData.value.host,
        port: formData.value.port,
        user: formData.value.user,
        pass: formData.value.pass,
    }))

    formData.value.type = ""
    formData.value.name = ""
    formData.value.host = ""
    formData.value.port = 0
    formData.value.user = ""
    formData.value.pass = ""

    showForm.value = false

    toast.success("Connection added")
}

const handleConnect = async (details: database.ConnectionDetails): Promise<void> => {
    //await Connect(database.ConnectionDetails.createFrom({
    //    type: details.type == database.ConnectionType.MySQL 
    //        ? database.ConnectionType.MySQL 
    //        : database.ConnectionType.Postgres,
    //    name: details.name,
    //    host: details.host,
    //    port: details.port,
    //    user: details.user,
    //    pass: details.pass,
    //}))
    //console.log(details.type == database.ConnectionType.MySQL 
    //        ? database.ConnectionType.MySQL 
    //        : database.ConnectionType.Postgres, details.type)
    await Connect(details)
    globalStore.setConnection(details)
    router.push("/db")
}

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
