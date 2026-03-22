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
import { useLogStore } from '../../stores/logStore';

const logStore = useLogStore();

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

  const createFeature = (longitude: number, latitude: number, icon: string) => {
    const feature = new Feature({
      geometry: new Point(fromLonLat([longitude, latitude])),
    });

    const baseStyle = new Style({
      image: new Icon({
        src: icon,
        scale: 0.08,
        anchor: [0.5, 0.5],
      }),
    });

    feature.set('baseStyle', baseStyle);
    feature.set('highlighted', false); // toggle state
    feature.setStyle(baseStyle);

    return feature;
  };

  const infantry = createFeature(21.2611, 48.7164, '/infantry-allies.png');
  const enemy = createFeature(21.2611, 48.7264, '/infantry-enemy.png');
  const air = createFeature(21.2511, 48.7064, '/air-defence-allies.png');

  vectorSource.addFeatures([infantry, enemy, air]);

  const view = map.getView();

  const toggleCircle = (feature: Feature<Geometry>) => {
    const zoom = view.getZoom() || 13;
    const radius = Math.max(10, zoom * 5);
    const baseStyle = feature.get('baseStyle');
    const highlighted = feature.get('highlighted');

    if (highlighted) {
      feature.setStyle(baseStyle);
      feature.set('highlighted', false);
    } else {
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
  let currentlySelectedFeature: Feature<Geometry> | null = null;

  map.on('click', (e) => {
    let clickedFeature: Feature<Geometry> | undefined;

    map.forEachFeatureAtPixel(
      e.pixel,
      (feat) => {
        clickedFeature = feat as Feature<Geometry>;
        return true;
      },
      {
        hitTolerance: 5, // optional UX improvement
      }
    );

    // =========================
    // ❌ CLICKED EMPTY SPACE
    // =========================
    if (!clickedFeature) {
      if (!mapStore.isEditModalOpen) {
        if (currentlySelectedFeature) {
          const baseStyle = currentlySelectedFeature.get('baseStyle');
          if (baseStyle) {
            currentlySelectedFeature.setStyle(baseStyle);
          }
          currentlySelectedFeature.set('highlighted', false);
          currentlySelectedFeature = null;
        }

        mapStore.clearSelectedUnit();
      }
      return;
    }

    // ✅ TS-safe (guaranteed not undefined here)
    const feature = clickedFeature;

    // =========================
    // 🔵 DISTANCE MODE
    // =========================
    if (mapStore.isEditModalOpen) {
      toggleCircle(feature);
      mapStore.addFeatureToSelection(feature as Feature<Point>);
      return;
    }

    // =========================
    // 🟢 NORMAL MODE
    // =========================

    // Click same → unselect
    if (currentlySelectedFeature === feature) {
      const baseStyle = feature.get('baseStyle');
      if (baseStyle) {
        feature.setStyle(baseStyle);
      }
      feature.set('highlighted', false);

      currentlySelectedFeature = null;
      mapStore.clearSelectedUnit();
      return;
    }

    // Unselect previous
    if (currentlySelectedFeature) {
      const baseStyle = currentlySelectedFeature.get('baseStyle');
      if (baseStyle) {
        currentlySelectedFeature.setStyle(baseStyle);
      }
      currentlySelectedFeature.set('highlighted', false);
    }

    // Select new
    toggleCircle(feature);
    currentlySelectedFeature = feature;

    mapStore.setSelectedUnit(feature as Feature<Point>);
    logStore.addLog(`Entity ${feature.get('callsign') || 'Unknown'} selected`);
  });

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