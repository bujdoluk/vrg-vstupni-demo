<template>
  <v-card elevation="0" class="height" variant="outlined" :rounded="false">
    <v-card-title>Unit Info</v-card-title>
    <v-card-text class="py-0" v-if="unit">
      Type: {{ unit.type }}
    </v-card-text>
    <v-card-text class="py-0" v-if="unit">
      Callsign: {{ unit.callsign }}
    </v-card-text>
    <v-card-text class="py-0" v-if="unit">
      Position: {{ unit.position }}
    </v-card-text>
    <v-card-text class="py-0" v-if="unit">
      Current task: {{ unit.task }}
    </v-card-text>
    <v-card-text class="py-0" v-else>
      Click a feature on the map to see details.
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useMapStore } from '../../stores/mapStore';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

const mapStore = useMapStore();
const { selectedUnit } = storeToRefs(mapStore); // safely unwrap reactive ref
const unit = computed(() => selectedUnit.value);
</script>

<style scoped>
.height {
  height: 100%;
  background-color: white;
}
</style>