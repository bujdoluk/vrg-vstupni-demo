import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLogStore = defineStore('log', () => {
  const logs = ref<Array<string>>([]);

  const add = (message: string): void => {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0]; 
    logs.value.push(`[${timestamp}] ${message}`);
  };

  const clear = (): void => {
    logs.value = [];
  };

  return {
    logs,
    add,
    clear,
  };
});