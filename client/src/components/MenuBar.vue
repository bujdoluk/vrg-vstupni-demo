<template>
    <v-container fluid height="32px" class="pa-0">
        <v-row align="center">
            <v-col cols="2">
                <v-btn variant="text" class="border-e-md" :rounded="false">
                    {{ t('file') }}
                </v-btn>
                <v-btn
                    variant="text"
                    class="border-e-md"
                    :rounded="false"
                    @click="toggleEdit"
                >
                    {{ t('edit') }}
                </v-btn>
                <v-btn variant="text" class="border-e-md" :rounded="false">
                    {{ t('view') }}
                </v-btn>
                <v-btn variant="text" :rounded="false">
                    {{ t('...') }}
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

const toggleEdit = () => {
  mapStore.toggleEditModal();
};
</script>