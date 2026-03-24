<template>
    <v-container 
        fluid 
        height="32px" 
        class="pa-0"
    >
        <v-row align="center">
            <v-col cols="2">
                <v-btn 
                    variant="text" 
                    class="border-e-md" 
                    :rounded="false"
                >
                    {{ t('file') }}
                </v-btn>
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      variant="text"
                      class="border-e-md"
                      :rounded="false"
                    >
                      {{ t('edit') }}
                    </v-btn>
                  </template>

                  <v-list density="compact">
                    <v-list-item @click="onMeasureDistance">
                      <v-list-item-title>
                        {{ t('measureTitle') }}
                      </v-list-item-title>
                    </v-list-item>

                    <v-list-item @click="onMoveUnit">
                      <v-list-item-title>
                        {{ t('moveUnit') }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-btn 
                    variant="text" 
                    class="border-e-md" 
                    :rounded="false"
                >
                    {{ t('view') }}
                </v-btn>
                <v-btn 
                    variant="text" 
                    :rounded="false"
                >
                    ...
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { useMapStore } from "../stores/mapStore";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const mapStore = useMapStore();

const onMeasureDistance = (): void => {
  mapStore.toggleEditModal();
};

const onMoveUnit = (): void => {
  if (!mapStore.selectedUnit) return;
  mapStore.enableMoveMode();
};
</script>