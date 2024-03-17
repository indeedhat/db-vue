<template>
    <div class="p-4">
        <std-button @click="openForm()">Add Connection</std-button>
    </div>
    <div v-if="showForm">
        <div id="form" class="grid gap-2">
            <std-select v-model="formData.type" label="Database Type" :disabled="formData.edit">
                <option :value="database.ConnectionType.MySQL">
                    {{ database.ConnectionType.MySQL }}
                </option>
                <option :value="database.ConnectionType.Postgres">
                    {{ database.ConnectionType.Postgres }}
                </option>
            </std-select>
            <std-input label="name" v-model="formData.name" :disabled="formData.edit"/>
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
            @click.left="() => handleConnect(con)" 
            @click.right.prevent="(e: MouseEvent) => openContext(e, con)" 
        />
    </div>
    <context-menu ref="contextMenu">
        <context-item @click="editConnection()">Edit</context-item>
        <context-item @click="deleteConnection()">Delete</context-item>
    </context-menu>
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
import ContextMenu, { type ContextMenuType } from '@/components/context-menu/ContextMenu.vue'
import ContextItem from '@/components/context-menu/ContextItem.vue'

const router = useRouter()
const toast = useToast()

const contextConnection = ref<database.ConnectionDetails>()
const contextMenu = ref<ContextMenuType>()
const showForm = ref<Boolean>()
const formData = ref({
    edit: false,
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
    } else if (!formData.value.edit && store.hasConnection(formData.value.name)) {
        toast.error("name in use")
        return
    }

    store.addConnection(database.ConnectionDetails.createFrom({
        type: formData.value.type,
        name: formData.value.name,
        host: formData.value.host,
        port: ~~formData.value.port,
        user: formData.value.user,
        pass: formData.value.pass,
    }))

    showForm.value = false

    toast.success(`Connection ${formData.value.edit ? 'updated' : 'added'}`)
}

const openForm = (con: database.ConnectionDetails | null = null) => {
    showForm.value = false

    formData.value.edit = con !== null
    formData.value.type =  ""
    formData.value.name =  ""
    formData.value.host =  ""
    formData.value.port =  0
    formData.value.user =  ""
    formData.value.pass =  ""

    setTimeout(() => {
        if (con) {
            formData.value.type = con.type
            formData.value.name = con.name
            formData.value.host = con.host
            formData.value.port = con.port
            formData.value.user = con.user
            formData.value.pass = con.pass
        }

        showForm.value = true
    }, 0)
}

const handleConnect = async (con: database.ConnectionDetails): Promise<void> => {
    await Connect(con)
    globalStore.setConnection(con)
    router.push("/db")
}

const openContext = (e: MouseEvent, con: database.ConnectionDetails) => {
    contextConnection.value = con
    contextMenu.value?.open(e.screenX, e.screenY)
}
const editConnection = () => {
    contextMenu.value?.close()
    openForm(contextConnection.value)
}
const deleteConnection = () => {
    contextMenu.value?.close()
    store.removeConnection(contextConnection.value!)
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
