import { Identifier } from '@babel/types'
import { reactive, ref, readonly, InjectionKey, provide, inject, Ref, onUnmounted, computed, ComputedRef } from 'vue'

export interface TabData {
    name: string
    onRemove?: () => void
}

const tabsInjectionKey = Symbol('tabs') as InjectionKey<{
    register: (identifier: symbol, tabData: TabData) => void,
    deregister: (identifier: symbol) => void
    active: Readonly<Ref<symbol|undefined>>,
}>


interface UseTabs {
    tabs: ReadonlyMap<symbol, TabData>
    setActive: (identifier: symbol) => void
    isActive: (identifier: symbol) => Boolean
    deregister: (Identifier: symbol) => void
}

export const useTabs = (): UseTabs => {
    const tabs = reactive(new Map<symbol, TabData>())

    const active = ref<symbol>()
    const register = (identifier: symbol, tabData: TabData) => {
        tabs.set(identifier, tabData)
        if (tabs.size === 1) {
            setActive(identifier)
        }
    }
    const deregister = (identifier: symbol) => {
        const tab = tabs.get(identifier)

        const keys = [ ...Array.from(tabs.keys()) ]
        const keyIdx = keys.indexOf(identifier)
        const newId = keys[keyIdx == 0 ? 1 : keyIdx-1]
        if (newId) {
            setActive(newId)
        }

        tabs.delete(identifier)

        if (tab?.onRemove) {
            tab.onRemove()
        }
    }

    provide(tabsInjectionKey, {
        register,
        deregister,
        active: readonly(active),
    })

    const setActive = (identifier: symbol) => {
    active.value = identifier
    }
    const isActive = (identifier: symbol): Boolean => (
        active.value === identifier
    )

    return {
        tabs: readonly(tabs),
        setActive,
        isActive,
        deregister
    }
}

interface UseTab {
    isActive: ComputedRef<boolean>
    deregister: (Identifier: symbol) => void
}

export const useTab = (tabData: TabData): UseTab => {
    const tabsInjection = inject(tabsInjectionKey)
    if (!tabsInjection) {
        throw new Error('Tabs were not provided')
    }

    const { register, deregister, active } = tabsInjection
    const tabSymbol = Symbol(tabData.name)
    const isActive = computed(() => (active.value === tabSymbol))

    register(tabSymbol, tabData)
    onUnmounted(() => {
        console.log("unmount")
        deregister(tabSymbol)
    })

    return {
        isActive,
        deregister
    }
}
