<template>
    <v-card elevation="0">
        <v-card-title>Simulation State</v-card-title>
        <v-card-text>
            <v-btn-toggle>
                <v-btn variant="outlined">
                    <v-icon icon="mdi-play" />
                </v-btn>
                <v-btn variant="outlined">
                    <v-icon icon="mdi-play-pause"></v-icon>
                </v-btn>
                <v-btn variant="outlined">
                    <v-icon icon="mdi-stop"></v-icon>
                </v-btn>
            </v-btn-toggle>
        </v-card-text>
        <v-card-text>
            Current time:
        </v-card-text>
        <v-card-text>
            00:10:00
        </v-card-text>
    </v-card>
</template>
