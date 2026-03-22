import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLogStore = defineStore('log', () => {
  const logs = ref<string[]>([]);

  const addLog = (message: string) => {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0]; 
    logs.value.push(`[${timestamp}] ${message}`);
  };

  const clearLogs = () => {
    logs.value = [];
  };

  return {
    logs,
    addLog,
    clearLogs,
  };
});