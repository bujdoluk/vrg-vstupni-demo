<template>
  <v-card elevation="0" class="log" variant="outlined" :rounded="false">
    <v-card-title>{{ t('logInfo') }}</v-card-title>
    <v-card-text class="log-container">
      <div v-for="(log, index) in logs" :key="index" class="log-item">
        {{ log }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useLogStore } from '../../stores/logStore';
import { onUpdated, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const logStore = useLogStore();
const { logs } = storeToRefs(logStore);

// Optional: auto-scroll to bottom when new log appears
const scrollToBottom = () => {
  const container = document.querySelector('.log-container');
  if (container) container.scrollTop = container.scrollHeight;
};

// Run scroll after each update
onUpdated(() => {
  nextTick(scrollToBottom);
});
</script>

<style scoped>
.log {
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
}

.log-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
}

.log-item {
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 0.875rem;
}
</style>