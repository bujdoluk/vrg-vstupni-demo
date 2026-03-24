import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useSimulationStore } from './simulationStore';

export const useLogStore = defineStore('log', () => {
  const simulationStore = useSimulationStore();
  const logs = ref<Array<string>>([]);

  const add = (message: string): void => {
    logs.value.push(`[${simulationStore.formattedTime}] ${message}`);
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