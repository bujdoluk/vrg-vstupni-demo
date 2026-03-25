<template>
  <div id="map" class="map-view border"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { fromLonLat } from 'ol/proj';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from 'ol/style';
import Geometry from 'ol/geom/Geometry';
import { useMapStore } from '../../stores/mapStore';
import { useLogStore } from '../../stores/logStore';
import type { MapBrowserEvent } from 'ol';

const logStore = useLogStore();
const mapStore = useMapStore();

let moveLineFeature: Feature<LineString> | null = null;
let movePathCoordinates: number[][] = [];

const vectorSource = new VectorSource();
const vectorLayer = new VectorLayer({ source: vectorSource });

const createMap = () => {
  const map = new Map({
    target: 'map',
    layers: [new TileLayer({ source: new OSM() }), vectorLayer],
    view: new View({ center: fromLonLat([21.2611, 48.7164]), zoom: 13 }),  
    controls: [],
  });
  
  return { map };
};

const createFeature = (
  longitude: number,
  latitude: number,
  icon: string,
  type: string,
  callsign: string,
  affiliation: string
): Feature<Point> => {
  const feature = new Feature({ geometry: new Point(fromLonLat([longitude, latitude])) });
  const initialStyle = new Style({ image: new Icon({ src: icon, scale: 0.08, anchor: [0.5, 0.5] }) });

  feature.set('initialStyle', initialStyle);
  feature.set('circleHighlight', false);
  feature.setStyle(initialStyle);
  feature.set('type', type);
  feature.set('callsign', callsign);
  feature.set('affiliation', affiliation);
  return feature;
};

const toggleCircleHighlight = (view: View, feature: Feature<Geometry>) => {
  const zoom = view.getZoom() || 13;
  const radius = Math.max(10, zoom * 5);
  const initialStyle = feature.get('initialStyle');
  const isHighlighted = feature.get('circleHighlight');

  if (isHighlighted) {
    feature.setStyle(initialStyle);
    feature.set('circleHighlight', false);
  } else {
    feature.setStyle([
      new Style({
        image: new CircleStyle({
          radius,
          fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
          stroke: new Stroke({ color: 'orange', width: 2, lineDash: [6, 4] }),
        }),
      }),
      initialStyle,
    ]);
    feature.set('circleHighlight', true);
  }
};

const onMoveUnitClick = (event: MapBrowserEvent, vectorSource: VectorSource, selectedFeature: Feature<Geometry>) => {
  const geometry = selectedFeature.getGeometry();
  if (!(geometry instanceof Point)) return;

  const clickedPoint = event.coordinate;

  if (movePathCoordinates.length === 0) {
    movePathCoordinates.push(geometry.getCoordinates());
  }

  movePathCoordinates.push(clickedPoint);

  if (moveLineFeature) {
    vectorSource.removeFeature(moveLineFeature);
  }

  moveLineFeature = new Feature({
    geometry: new LineString(movePathCoordinates),
  });

  moveLineFeature.setStyle(
    new Style({
      stroke: new Stroke({
        color: 'orange',
        width: 2,
        lineDash: [6, 4],
      }),
    })
  );

  vectorSource.addFeature(moveLineFeature);
  logStore.add(`Move command issued for ${selectedFeature.get('callsign')}`);
};

const clearSelection = (selectedFeature: { value: Feature<Geometry> | null }) => {
  if (selectedFeature.value) {
    const initialStyle = selectedFeature.value.get('initialStyle');
    if (initialStyle) selectedFeature.value.setStyle(initialStyle);
    selectedFeature.value.set('circleHighlight', false);
    selectedFeature.value = null;
  }

  mapStore.clearSelectedUnit();
};

const resetMoveLine = (vectorSource: VectorSource) => {
  movePathCoordinates = [];

  if (moveLineFeature) {
    vectorSource.removeFeature(moveLineFeature);
    moveLineFeature = null;
  }
};

const getClickedFeature = (map: Map, pixel: number[]) => {
  let clickedFeature: Feature<Geometry> | undefined;

  map.forEachFeatureAtPixel(
    pixel,
    (feature) => {
      clickedFeature = feature as Feature<Geometry>;
      return true;
    },
    { hitTolerance: 5 }
  );

  return clickedFeature;
};

const selectFeature = (
  feature: Feature<Geometry>,
  view: View,
  selectedFeature: { value: Feature<Geometry> | null },
  vectorSource: VectorSource
) => {
  if (selectedFeature.value) {
    const prevStyle = selectedFeature.value.get('initialStyle');
    if (prevStyle) selectedFeature.value.setStyle(prevStyle);
    selectedFeature.value.set('circleHighlight', false);
  }

  toggleCircleHighlight(view, feature);
  selectedFeature.value = feature;

  resetMoveLine(vectorSource);

  mapStore.setSelectedUnit(feature as Feature<Point>);
  logStore.add(`Entity ${feature.get('callsign')} selected`);
};

const onMapClick = (
  event: MapBrowserEvent,
  map: Map,
  view: View,
  vectorSource: VectorSource,
  mapStore: ReturnType<typeof useMapStore>,
  selectedFeature: { value: Feature<Geometry> | null }
) => {
  if (mapStore.isMoveMode && selectedFeature.value) {
    onMoveUnitClick(event, vectorSource, selectedFeature.value);
    return;
  }

  const feature = getClickedFeature(map, event.pixel);

  if (!feature) {
    if (!mapStore.isOpen) {
      clearSelection(selectedFeature);
    }
    return;
  }

  if (mapStore.isOpen) {
    toggleCircleHighlight(view, feature);
    mapStore.addSelectedFeature(feature as Feature<Point>);
    return;
  }

  if (selectedFeature.value === feature) {
    clearSelection(selectedFeature);
    return;
  }

  selectFeature(feature, view, selectedFeature, vectorSource);
};

const onEscape = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return;

  if (moveLineFeature) {
    vectorSource.removeFeature(moveLineFeature);
    movePathCoordinates = [];
    moveLineFeature = null;
  }
 
  mapStore.disableMoveMode();
  logStore.add('Move command cancelled');
};

onMounted(() => {
  const { map } = createMap();
  const view = map.getView();

  const selectedFeature = { value: null };

  const infantry = createFeature(21.2611, 48.7164, '/infantry-allies.png', 'Infantry', 'A1', 'Ally');
  const enemyInfantry = createFeature(21.2611, 48.7264, '/infantry-enemy.png', 'Infantry', 'E1', 'Enemy');
  const airDefence = createFeature(21.2511, 48.7064, '/air-defence-allies.png', 'Air defence', 'AD1', 'Ally');
  vectorSource.addFeatures([infantry, enemyInfantry, airDefence]);

  map.on('click', (event: MapBrowserEvent) => onMapClick(event, map, view, vectorSource, mapStore, selectedFeature));

  window.addEventListener('keydown', onEscape);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onEscape);
});
</script>

<style>
.map-view {
  width: 100%;
  height: 100%;
}
</style>