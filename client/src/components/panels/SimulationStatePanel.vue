<template>
  <v-card 
    elevation="0" 
    class="simulation" 
    variant="outlined" 
    :rounded="false"
  >
    <v-card-title>{{ t('simulationState') }}</v-card-title>

    <v-card-text class="d-flex justify-center py-2">
      <v-btn-toggle v-model="simulation" mandatory>
        <v-btn 
          variant="outlined" 
          value="play" 
          @click="start"
        >
          <v-icon icon="mdi-play" />
        </v-btn>

        <v-btn 
          variant="outlined" 
          value="pause" 
          @click="togglePause"
        >
          <v-icon icon="mdi-play-pause" />
        </v-btn>

        <v-btn 
          variant="outlined" 
          value="stop" 
          @click="stop"
        >
          <v-icon icon="mdi-stop" />
        </v-btn>
      </v-btn-toggle>
    </v-card-text>

    <v-card-text class="py-2 text-center">
      {{ t('currentTime') }}
    </v-card-text>

    <v-card-text class="py-2 text-display-large text-center font-weight-bold">
      {{ simulationStore.formattedTime }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useLogStore } from '../../stores/logStore';
import { useSimulationStore } from '../../stores/simulationStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const logStore = useLogStore();
const simulationStore = useSimulationStore();

const simulation = ref<string>('');
let timer: number | null = null;

const start = (): void => {
  if (timer) return;

  timer = setInterval(() => {
    simulationStore.increment();
  }, 1000);

  simulation.value = 'play';
  logStore.add(t('simulationStarted'));
};

const togglePause = (): void => {
  if (timer) {
    clearInterval(timer);
    timer = null;
    simulation.value = 'pause';
    logStore.add(t('simulationPaused'));
  } else {
    timer = setInterval(() => {
      simulationStore.increment();
    }, 1000);

    simulation.value = 'play';
    logStore.add(t('simulationResumed'));
  }
};

const stop = (): void => {
  if (timer) clearInterval(timer);
  logStore.add(t('simulationStopped'));
  timer = null;
  simulationStore.clear();
  simulation.value = 'stop';
};

onUnmounted((): void => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.simulation {
  height: 100%;
  background-color: white;
}
</style>