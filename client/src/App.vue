<template>
  <div class="grid">
    <div class="map bg-green">
      <MapItem />
    </div>
    <div class="simulation bg-yellow">
      <SimulationState />
    </div>
    <div class="unit bg-yellow">
      <UnitInfo />
    </div>
    <div class="log bg-yellow">
      <LogInfo />
    </div>
  </div>
</template>

<script setup lang="ts">
import MapItem from "./components/MapItem.vue";
import SimulationState from "./components/SimulationState.vue";
import LogInfo from "./components/LogInfo.vue";
import UnitInfo from "./components/UnitInfo.vue";
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-areas: 
    "map map map simulation"
    "map map map unit"
    "map map map log";
}

.map {
  grid-area: map;
  min-height: 100vh;
}

.simulation {
  grid-area: simulation;
}

.unit {
  grid-area: unit;
}

.log {
  grid-area: log;
}
</style>
