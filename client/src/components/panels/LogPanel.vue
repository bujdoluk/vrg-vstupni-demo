<template>
  <v-card 
    elevation="0" 
    class="log-card" 
    variant="outlined" 
    :rounded="false"
  >
    <v-card-title>{{ t('logInfo') }}</v-card-title>
    <v-card-text class="log-container">
      <div 
        v-for="(log, index) in logs" 
        :key="index"
      >
        {{ log }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useLogStore } from '../../stores/logStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const logStore = useLogStore();
const { logs } = storeToRefs(logStore);

</script>

<style scoped>
.log-card {
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
}

.log-container {
  flex: 1;
  overflow-y: auto;
}
</style>