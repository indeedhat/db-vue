<template>
    <section class="tab-container">
        <ul class="tabs flex overflow-x-auto whitespace-nowrap dark:bg-neutral-800 border-b border-grey-300 dark:border-neutral-700">
            <li v-for="[identifier, tab] in tabs.entries()" 
                :key="identifier" 
                @click="setActive(identifier)"
                class="inline-flex items-center h-12 px-4 py-2 text-sm text-center text-gray-700 border-gray-300 sm:text-base dark:text-white whitespace-nowrap dark:border-neutral-700 dark:hover:bg-neutral-700"
                :class="{
                    ['border border-b-0 dark:bg-neutral-700']: isActive(identifier),
                    ['bg-transparent dark:text-white whitespace-nowrap cursor-base  hover:border-gray-400 dark:hover:border-gray-300']: !isActive(identifier),
                }"
            >
                {{ tab.name }}
                <span v-if="isActive(identifier)"
                    @click.stop="deregister(identifier)"
                    class="cursor-pointer ml-4 -mr-2 -mt-4 dark:text-neutral-400"
                >x</span>
            </li>
        </ul>
        <section class="active-tab">
            <slot />
        </section>
    </section>
</template>

<script lang="ts" setup>
import { useTabs } from './useTabs'

const { tabs, setActive, isActive, deregister } = useTabs()
</script>
