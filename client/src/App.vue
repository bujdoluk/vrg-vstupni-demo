<template>
  <div>
    <div 
      v-if="!isConnected" 
      class="loading"
    >
      <v-progress-circular indeterminate></v-progress-circular>
      <p>{{ t('connecting') }}</p>
    </div>

    <div v-else>
      <MenuBar />
      <DockviewVue 
        class="dockview" 
        @ready="onReady" 
      />
      <MeasureDistanceModal />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import MenuBar from "./components/MenuBar.vue";
import MeasureDistanceModal from "./components/MeasureDistanceModal.vue";
import { type DockviewReadyEvent, DockviewVue } from "dockview-vue";
import { useSocketStore } from "./stores/socketStore";
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const socketStore = useSocketStore();
const { isConnected } = storeToRefs(socketStore);

const onReady = (event: DockviewReadyEvent): void => {
  const api = event.api;

  const mapPanel = api.addPanel({
    id: "map",
    component: "mapPanel",
    tabComponent: "mapTab",
  });

  const simulationPanel = api.addPanel({
    id: "simulation",
    component: "simulationStatePanel",
    tabComponent: "simulationStateTab",
    position: {
      referencePanel: mapPanel,
      direction: "right",
    },
  });

  const unitPanel = api.addPanel({
    id: "unit",
    component: "unitInfoPanel",
    tabComponent: "unitInfoTab",
    position: {
      referencePanel: simulationPanel,
      direction: "below",
    },
  });

  const logPanel = api.addPanel({
    id: "log",
    component: "logPanel",
    tabComponent: "logInfoTab",
    position: {
      referencePanel: unitPanel,
      direction: "below",
    },
  });
};

onMounted(() => {
  socketStore.connect();
});
</script>

<style scoped>
.dockview {
  width: 100%;
  height: calc(100vh - 32px);
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: white;
}
</style>