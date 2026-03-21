<template>
  <div id="map" class="map-view border"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from 'ol/style';
import Geometry from 'ol/geom/Geometry';
import { useMapStore } from "../../stores/mapStore";

onMounted(() => {
  const vectorSource = new VectorSource();

  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  const map = new Map({
    target: 'map',
    layers: [
      new TileLayer({ source: new OSM() }),
      vectorLayer,
    ],
    view: new View({
      center: fromLonLat([21.2611, 48.7164]),
      zoom: 13,
    }),
  });

  // --- Helper to create feature with base style ---
  const createFeature = (lon: number, lat: number, icon: string) => {
    const f = new Feature({
      geometry: new Point(fromLonLat([lon, lat])),
    });

    const baseStyle = new Style({
      image: new Icon({
        src: icon,
        scale: 0.08,
        anchor: [0.5, 0.5],
      }),
    });

    f.set('baseStyle', baseStyle);
    f.set('highlighted', false); // toggle state
    f.setStyle(baseStyle);

    return f;
  };

  const infantry = createFeature(21.2611, 48.7164, '/infantry-allies.png');
  const enemy = createFeature(21.2611, 48.7264, '/infantry-enemy.png');
  const air = createFeature(21.2511, 48.7064, '/air-defence-allies.png');

  vectorSource.addFeatures([infantry, enemy, air]);

  const view = map.getView();

  // --- Toggle circle highlight on feature ---
  const toggleCircle = (feature: Feature<Geometry>) => {
    const zoom = view.getZoom() || 13;
    const radius = Math.max(10, zoom * 5);
    const baseStyle = feature.get('baseStyle');
    const highlighted = feature.get('highlighted');

    if (highlighted) {
      // remove circle
      feature.setStyle(baseStyle);
      feature.set('highlighted', false);
    } else {
      // add circle
      feature.setStyle([
        new Style({
          image: new CircleStyle({
            radius,
            fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
            stroke: new Stroke({
              color: 'orange',
              width: 2,
              lineDash: [6, 4],
            }),
          }),
        }),
        baseStyle,
      ]);
      feature.set('highlighted', true);
    }
  };

  const mapStore = useMapStore();

  // --- Click handler ---
  map.on('click', (e) => {
    map.forEachFeatureAtPixel(e.pixel, (feat) => {
      toggleCircle(feat as Feature<Geometry>);

      mapStore.setSelectedUnit(feat as Feature<Point>);

      if (mapStore.isEditModalOpen) {
        mapStore.addFeatureToSelection(feat as Feature<Point>);
      }
      return true; // stop after first feature
    });
  });

  // --- Update circle radius on zoom ---
  view.on('change:resolution', () => {
    vectorSource.getFeatures().forEach((f) => {
      if (f.get('highlighted')) {
        const zoom = view.getZoom() || 13;
        const radius = Math.max(10, zoom * 5);
        const baseStyle = f.get('baseStyle');
        f.setStyle([
          new Style({
            image: new CircleStyle({
              radius,
              fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
              stroke: new Stroke({
                color: 'orange',
                width: 2,
                lineDash: [6, 4],
              }),
            }),
          }),
          baseStyle,
        ]);
      }
    });
  });
});
</script>

<style>
.map-view {
  width: 100%;
  height: 100%;
}
</style>