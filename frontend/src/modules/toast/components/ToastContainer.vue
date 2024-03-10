<template>
  <section id="toast" class="fixed right-0 top-0 z-50 flex flex-col p-4">
    <notice
      v-for="entry in [...notifications].reverse()"
      :key="entry.id"
      :type="entry.type"
      :title="entry.title"
      @click="close(entry)"
    >
      {{ entry.body }}
    </notice>
  </section>
</template>

<script lang="ts" setup>
import { useToast, type Notification } from '../useToast'
import Notice from '@/components/Notice.vue'

const { getNotifications: notifications, close } = useToast()
</script>
