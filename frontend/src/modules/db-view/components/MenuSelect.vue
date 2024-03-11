<template>
    <li class="px-4 py-2 dark:border-neutral-700 border-b dark:bg-neutral-700 relative  dark:hover:bg-neutral-600 cursor-pointer"
        @click.prevent="toggleOpen()"
    >
        {{ items[selected] ?? "NOPE" }}
        <ul class="dark:border-neutral-600 border-r dark:bg-neutral-700 min-w-[200px] absolute top-0 left-[100%] z-50"
            v-if="open"
        >
            <menu-item v-for="(item, index) in items" :key="index" @click.stop="select(index)" class="dark:border-neutral-600 dark:hover:bg-neutral-600 cursor-pointer">
                {{ item }}
            </menu-item>
        </ul>
    </li>
</template>

<script setup lang="ts">
import type { PropType, Ref } from 'vue'
import { ref, onMounted } from 'vue'

import MenuItem from '@/modules/db-view/components/MenuItem.vue'

const props = defineProps<{
    items: string[]
    active?: string
    onSelect?: (e: string) => void
}>()

const initialSelect = props.items.indexOf(props.active ?? '')
const selected: Ref<number> = ref(initialSelect !== -1 ? initialSelect : 0)
const select = (i: number) => {
    selected.value = i
    toggleOpen()

    if (props.onSelect) {
        props.onSelect(props.items[i])
    }
}

const open: Ref<Boolean> = ref(false)
const toggleOpen = (force: Boolean|null = null) => {
    console.log(force, !open.value)
    open.value = force ?? !open.value
}
</script>
