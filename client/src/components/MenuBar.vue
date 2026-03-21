<template>
    <v-container fluid height="32px" class="pa-0">
        <v-row align="center">
            <v-col cols="2">
                <v-btn variant="text" class="border-e-md" :rounded="false">
                    File
                </v-btn>
                <v-btn
                    variant="text"
                    class="border-e-md"
                    :rounded="false"
                    @click="toggleEdit"
                >
                    Edit
                </v-btn>
                <v-btn variant="text" class="border-e-md" :rounded="false">
                    View
                </v-btn>
                <v-btn variant="text" :rounded="false">
                    ...
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { useMapStore } from "../stores/mapStore";

const mapStore = useMapStore();

const toggleEdit = () => {
  mapStore.toggleEditModal();
};
</script>