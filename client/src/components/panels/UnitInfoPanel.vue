<template>
  <v-card elevation="0" class="height" variant="outlined" :rounded="false">
    <v-card-title>{{ t('unitInfo') }}</v-card-title>
    <v-card-text class="py-0" v-if="unit">
      {{ t('type') }}: {{ unit.type }}
    </v-card-text>
    <v-card-text class="py-0" v-if="unit">
      {{ t('callsign') }}: {{ unit.callsign }}
    </v-card-text>
    <v-card-text class="py-0" v-if="unit">
      {{ t('position') }}: {{ unit.position }}
    </v-card-text>
    <v-card-text class="py-0" v-if="unit">
      {{ t('currentTask') }}: {{ unit.task }}
    </v-card-text>
    <v-card-text class="py-0" v-if="unit">
      {{ t('affiliation') }}: {{ unit.affiliation }}
    </v-card-text>
    <v-card-text class="py-0" v-if="unit">
      {{ t('speed') }}: {{ unit.speed }}
    </v-card-text>
    <v-card-text class="py-0" v-if="unit">
      {{ t('damage') }}: {{ unit.damage }}
    </v-card-text>
    <v-card-text class="py-0" v-if="unit">
      {{ t('ammunition') }}: {{ unit.ammunition }}
    </v-card-text>
    <v-card-text class="py-0" v-else>
      {{ t('clickFeature') }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useMapStore } from '../../stores/mapStore';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const mapStore = useMapStore();
const { selectedUnit } = storeToRefs(mapStore); 
const unit = computed(() => selectedUnit.value);
</script>

<style scoped>
.height {
  height: 100%;
  background-color: white;
}
</style>