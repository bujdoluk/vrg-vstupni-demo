<template>
    <v-card elevation="0" class="log" variant="outlined" :rounded="false">
        <v-card-title>Log Info</v-card-title>
        <v-card-text class="py-0">[00:00:00] Sim start</v-card-text>
        <v-card-text class="py-0">[00:00:01] Entity A1 selected</v-card-text>
        <v-card-text class="py-0">[00:00:09] New target for entity A1</v-card-text>
    </v-card>
</template>

<style scoped>
.log {
    height: 100%;
    background-color: white;
}
</style>