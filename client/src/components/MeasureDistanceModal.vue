<template>
  <v-sheet
    v-if="store.isEditModalOpen"
    elevation="4"
    class="floating-modal pa-4"
  >
    <div class="modal-header">
      <span>Measure Distance</span>
      <v-btn icon small @click="closeModal">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <div class="modal-body">
      <div v-if="store.distance !== null">
        Distance: {{ store.distance.toFixed(2) }} km
      </div>

      <div v-else-if="store.selectedFeatures.length === 1">
        1 feature selected. Click another feature to measure distance.
      </div>

      <div v-else>
        Click 2 features on the map to measure distance.
      </div>

      <div v-if="store.selectionError" class="error-msg">
        {{ store.selectionError }}
      </div>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { useMapStore } from "../stores/mapStore";
const store = useMapStore();

const closeModal = () => {
  store.clearSelection(); // remove selected features & circles
  store.toggleEditModal(); // hide modal
};
</script>

<style scoped>
.floating-modal {
  position: absolute;
  top: 100px;
  right: 580px;
  width: 280px;
  background-color: white;
  border-radius: 8px;
  z-index: 1000;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 8px;
}
.modal-body {
  font-size: 14px;
}
.error-msg {
  color: red;
  margin-top: 6px;
  font-weight: bold;
}
</style>