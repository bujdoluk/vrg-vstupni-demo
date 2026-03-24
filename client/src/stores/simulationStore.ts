import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useSimulationStore = defineStore('simulation', () => {
  const time = ref<number>(0);

  const formattedTime = computed(() => {
    const hours = Math.floor(time.value / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((time.value % 3600) / 60).toString().padStart(2, '0');
    const seconds = (time.value % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  });

  const increment = (): number => time.value++;
  const clear = (): number => (time.value = 0);

  return { time, formattedTime, increment, clear };
});