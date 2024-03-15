import { reactive, ref, readonly, InjectionKey, provide, inject, Ref, onUnmounted, computed, ComputedRef } from 'vue'

export interface TabData {
    name: string
    onRemove?: () => void
}

const tabsInjectionKey = Symbol('tabs') as InjectionKey<{
    register: (identifier: string, tabData: TabData) => void,
    deregister: (identifier: string) => void
    active: Readonly<Ref<string|undefined>>,
}>

type ActivateCallback = (Identifier: string) => void


interface UseTabs {
    tabs: ReadonlyMap<string, TabData>
    setActive: (identifier: string) => void
    isActive: (identifier: string) => Boolean
    deregister: (Identifier: string) => void
    onActivate: (fn: ActivateCallback) => void
}

export const useTabs = (): UseTabs => {
    let onActivateFn: ActivateCallback|undefined
    const tabs = reactive(new Map<string, TabData>())
    const active = ref<string>("")
    const register = (identifier: string, tabData: TabData) => {
        tabs.set(identifier, tabData)
        if (tabs.size === 1) {
            setActive(identifier)
        }
    }
    const deregister = (identifier: string) => {
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

    const setActive = (identifier: string) => {
        active.value = identifier
        if (onActivateFn) {
            onActivateFn(identifier)
        }
    }
    const isActive = (identifier: string): Boolean => ( 
        active.value === identifier
    )
    const onActivate = (fn: ActivateCallback): void => {
        onActivateFn = fn
    }

    return {
        tabs: readonly(tabs),
        setActive,
        isActive,
        deregister,
        onActivate
    }
}

interface UseTab {
    isActive: ComputedRef<boolean>
    deregister: (Identifier: string) => void
}

export const useTab = (tabData: TabData): UseTab => {
    const tabsInjection = inject(tabsInjectionKey)
    if (!tabsInjection) {
        throw new Error('Tabs were not provided')
    }

    const { register, deregister, active } = tabsInjection
    const tabSymbol = tabData.name
    const isActive = computed(() => (active.value === tabSymbol))

    register(tabSymbol, tabData)
    onUnmounted(() => deregister(tabSymbol))

    return {
        isActive,
        deregister
    }
}
