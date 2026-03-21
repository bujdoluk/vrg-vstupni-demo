<template>
  <div>
    <div v-if="!isConnected" class="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p>Connecting to server...</p>
    </div>

    <div v-else>
      <MenuBar />
      <DockviewVue class="dockview" @ready="onReady" />
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

const socketStore = useSocketStore();
const { isConnected } = storeToRefs(socketStore);

const onReady = (event: DockviewReadyEvent) => {
  const api = event.api;

  const mapPanel = api.addPanel({
    id: "map",
    component: "mapPanel",
    tabComponent: "mapTab",
    minimumWidth: 1500
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

  api.addPanel({
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
  font-size: 18px;
  background-color: #f5f5f5;
}
</style>