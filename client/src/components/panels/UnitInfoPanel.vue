<template>
  <v-card 
    elevation="0" 
    class="unit-card" 
    variant="outlined" 
    :rounded="false"
  >
    <v-card-title>{{ t('unitInfo') }}</v-card-title>
    <div v-if="selectedUnit" class="unit-container">
      <v-card-text class="py-0" >
        {{ t('type') }}: {{ selectedUnit.type }}
      </v-card-text>
      <v-card-text class="py-0" >
        {{ t('callsign') }}: {{ selectedUnit.callsign }}
      </v-card-text>
      <v-card-text class="py-0">
        {{ t('position') }}: {{ selectedUnit.position }}
      </v-card-text>
      <v-card-text class="py-0">
        {{ t('currentTask') }}: {{ selectedUnit.task }}
      </v-card-text>
      <v-card-text class="py-0">
        {{ t('affiliation') }}: {{ selectedUnit.affiliation }}
      </v-card-text>
      <v-card-text class="py-0">
        {{ t('speed') }}: {{ selectedUnit.speed }}
      </v-card-text>
      <v-card-text class="py-0">
        {{ t('damage') }}: {{ selectedUnit.damage }}
      </v-card-text>
      <v-card-text class="py-0">
        {{ t('ammunition') }}: {{ selectedUnit.ammunition }}
      </v-card-text>
    </div>
    <div v-else>
      <v-card-text class="py-0 unit-container">
        {{ t('clickFeature') }}
      </v-card-text>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useMapStore } from '../../stores/mapStore';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const mapStore = useMapStore();
const { selectedUnit } = storeToRefs(mapStore); 
</script>

<style scoped>
.unit-card {
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
}

.unit-container {
  flex: 1;
  overflow-y: auto;
}
</style>