<template>
  <div>
    <MenuBar />
    <DockviewVue class="dockview" @ready="onReady" />
  </div>
</template>

<script setup lang="ts">
import MenuBar from "./components/MenuBar.vue";
import {type DockviewReadyEvent, DockviewVue} from "dockview-vue";

const onReady = (event: DockviewReadyEvent) => {
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

</script>

<style scoped>
.dockview {
  width: 100%;
  height: calc(100vh - 32px);
}

</style>