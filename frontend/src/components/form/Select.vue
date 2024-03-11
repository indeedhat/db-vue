<template>
  <div class="flex flex-col gap-x-sm">
    <label v-if="label" :for="($attrs.id as string)" class="text-neutral-400">
        {{ label }}
    </label>
    <select v-bind="$attrs"
      v-model="internalVal"
      class="w-full rounded-sm border border-neutral-200 px-sm py-1 focus:outline-primary dark:border-neutral-500 dark:bg-neutral-600 text-neutral-700"
      @input="updateInput"
    >
        <slot />
    </select>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineOptions({ inheritAttrs: false })

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()
const props = defineProps<{
  label?: string
  modelValue?: string|number
}>()

const internalVal = ref(props.modelValue)

const updateInput = (event: Event) => {
    const target = <HTMLInputElement>event.target

  emit('update:modelValue', target.value)
}
</script>
