<template>
    <v-card elevation="0" class="simulation-state" variant="outlined" :rounded="false">
        <v-card-title>Simulation State</v-card-title>
        <v-card-text class="d-flex justify-center py-2">
            <v-btn-toggle v-model="activeBtn" mandatory>
                <v-btn variant="outlined" value="play" @click="start">
                    <v-icon icon="mdi-play" />
                </v-btn>
                <v-btn variant="outlined" value="pause" @click="togglePause">
                    <v-icon icon="mdi-play-pause"></v-icon>
                </v-btn>
                <v-btn variant="outlined" value="stop" @click="stop">
                    <v-icon icon="mdi-stop"></v-icon>
                </v-btn>
            </v-btn-toggle>
        </v-card-text>
        <v-card-text class="py-2 text-center">
            Current time:
        </v-card-text>
        <v-card-text class="py-2 text-display-large text-center font-weight-bold">
            {{ formattedTime }}
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';

const activeBtn = ref<string>('');
const time = ref<number>(0);
let timer: ReturnType<typeof setInterval> | null = null;

const formattedTime = computed(() => {
  const hours = Math.floor(time.value / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((time.value % 3600) / 60).toString().padStart(2, '0');
  const seconds = (time.value % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
});

const start = (): void => {
    if (timer) return;
    timer = setInterval(() => {
        time.value += 1;
    }, 1000);
    activeBtn.value = 'play';
};

const togglePause = (): void => {
  if (timer) {
    clearInterval(timer);
    timer = null;
    activeBtn.value = 'pause';
  } else {
    timer = setInterval(() => time.value += 1, 1000);
    activeBtn.value = 'play';
  }
};

const stop = (): void => {
    if (timer) clearInterval(timer);
    timer = null;
    time.value = 0;
    activeBtn.value = 'stop';
};

onUnmounted((): void => {
  if (timer) clearInterval(timer);
});

</script>

<style scoped>
.simulation-state {
    height: 100%;
    background-color: white;
}
</style>
