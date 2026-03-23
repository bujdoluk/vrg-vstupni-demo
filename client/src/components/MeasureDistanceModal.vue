<template>
  <v-sheet
    v-if="isOpen"
    elevation="4"
    class="container pa-4"
  >
    <div class="title">
      <span>{{ t('measureTitle') }}</span>
      <v-icon 
        icon="mdi-close" 
        @click="onClose"
      >
      </v-icon>
    </div>
    <div>
      <div v-if="distance !== null">
          {{ t('distance', { distance: distance.toFixed(2) }) }}
      </div>

      <div v-else-if="featureSelected">
        {{ t('featureSelected') }}
      </div>

      <div v-else>
        {{ t('measurmentInfo') }}
      </div>

      <div 
        v-if="error" 
        class="error"
      >
        {{ error }}
      </div>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMapStore } from "../stores/mapStore";
import { useI18n } from 'vue-i18n';
import { computed } from "vue";

const { t } = useI18n();
const mapStore = useMapStore();
const { isOpen, error, selectedFeatures, distance } = storeToRefs(mapStore);

const featureSelected = computed(() => selectedFeatures.value.length === 1);

const onClose = (): void => {
  mapStore.clearSelection(); 
  mapStore.toggleEditModal(); 
};

</script>

<style scoped>
.container {
  position: absolute;
  top: 100px;
  right: 60px;
  width: 280px;
  background-color: white;
  border-radius: 8px;
  z-index: 1000;
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 8px;
}

.error {
  color: red;
  margin-top: 6px;
  font-weight: bold;
}
</style>