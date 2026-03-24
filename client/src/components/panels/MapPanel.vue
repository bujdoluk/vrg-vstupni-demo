<template>
  <div 
    id="map" 
    class="map-view border">
  </div>
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

const createMap = () => {
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

  return { map, vectorLayer, vectorSource };
};

const createFeature = (
    longitude: number, 
    latitude: number, 
    icon: string, 
    type: string, 
    callsign: string, 
    affiliation: string
  ): Feature => {
    const feature = new Feature({
      geometry: new Point(fromLonLat([longitude, latitude])),
    });

    const initialStyle = new Style({
      image: new Icon({
        src: icon,
        scale: 0.08,
        anchor: [0.5, 0.5],
      }),
    });

    feature.set('initialStyle', initialStyle);
    feature.set('circleHighlight', false); 
    feature.setStyle(initialStyle);
    feature.set('type', type);
    feature.set('callsign', callsign);
    feature.set('affiliation', affiliation);

    return feature;
};

const toggleCircle = (view: View, feature: Feature<Geometry>) => {
  const zoom = view.getZoom() || 13;
  const radius = Math.max(10, zoom * 5);
  const initialStyle = feature.get('initialStyle');
  const circleHighlight = feature.get('circleHighlight');

  if (circleHighlight) {
    feature.setStyle(initialStyle);
    feature.set('circleHighlight', false);
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
      initialStyle,
    ]);
    feature.set('circleHighlight', true);
  }
};

const createView = (map: Map) => {
  const view = map.getView();
  return { view };
};

onMounted(() => {
  const { map, vectorSource } = createMap();
  const { view } = createView(map);

  const infantry = createFeature(21.2611, 48.7164, '/infantry-allies.png', "Infantry", "A1", "Ally");
  const enemyInfantry = createFeature(21.2611, 48.7264, '/infantry-enemy.png', "Infantry", "A1", "Enemy");
  const airDefence = createFeature(21.2511, 48.7064, '/air-defence-allies.png', "Air defence", "AD1", "Ally");
  vectorSource.addFeatures([infantry, enemyInfantry, airDefence]);

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
      if (!mapStore.isOpen) {
        if (currentlySelectedFeature) {
          const initialStyle = currentlySelectedFeature.get('initialStyle');
          if (initialStyle) {
            currentlySelectedFeature.setStyle(initialStyle);
          }
          currentlySelectedFeature.set('circleHighlight', false);
          currentlySelectedFeature = null;
        }

        mapStore.clearSelectedUnit();
      }
      return;
    }

    const feature = clickedFeature;

    // =========================
    // 🔵 DISTANCE MODE
    // =========================
    if (mapStore.isOpen) {
      toggleCircle(view, feature);
      mapStore.addSelectedFeature(feature as Feature<Point>);
      return;
    }

    // =========================
    // 🟢 NORMAL MODE
    // =========================

    // Click same → unselect
    if (currentlySelectedFeature === feature) {
      const initialStyle = feature.get('initialStyle');
      if (initialStyle) {
        feature.setStyle(initialStyle);
      }
      feature.set('circleHighlight', false);

      currentlySelectedFeature = null;
      mapStore.clearSelectedUnit();
      return;
    }

    // Unselect previous
    if (currentlySelectedFeature) {
      const initialStyle = currentlySelectedFeature.get('initialStyle');
      if (initialStyle) {
        currentlySelectedFeature.setStyle(initialStyle);
      }
      currentlySelectedFeature.set('circleHighlight', false);
    }

    // Select new
    toggleCircle(view, feature);
    currentlySelectedFeature = feature;

    mapStore.setSelectedUnit(feature as Feature<Point>);
    logStore.add(`Entity ${feature.get('callsign')} selected`);
  });

  view.on('change:resolution', () => {
    vectorSource.getFeatures().forEach((feature) => {
      if (feature.get('circleHighlight')) {
        const zoom = view.getZoom() || 13;
        const radius = Math.max(10, zoom * 5);
        const initialStyle = feature.get('initialStyle');
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
          initialStyle,
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