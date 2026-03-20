<template>
  <div id="map" class="map-view"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

onMounted(() => {
  new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      center: fromLonLat([21.2611, 48.7164]),
      zoom: 12
    })
  })
})
</script>

<style>
.map-view {
  width: 100%;
  height: 100%;
}
</style>