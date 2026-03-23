import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { toLonLat } from 'ol/proj';
import { getDistance } from 'ol/sphere';
import type { Unit } from '@/types';

export const useMapStore = defineStore('map', () => {
  const isOpen = ref<boolean>(false);
  const selectedFeatures = ref<Feature<Point>[]>([]);
  const distance = ref<number | null>(null);
  const error = ref<string | null>(null);
  const selectedUnit = ref<Unit | null>(null);

  const toggleEditModal = (): void => {
    isOpen.value = !isOpen.value;
    if (!isOpen.value) clearSelection();
  };

  const addFeatureToSelection = (feature: Feature<Point>) => {
    error.value = null;

    if (selectedFeatures.value.includes(feature)) return;

    if (selectedFeatures.value.length >= 2) {
      error.value = 'Already 2 features selected. Unselect one to choose another.';
      return;
    }

    selectedFeatures.value.push(feature);
    calculateDistance();
  };

  const removeSelected = (feature: Feature<Point>) => {
    selectedFeatures.value = selectedFeatures.value.filter(f => f !== feature);
    calculateDistance();
    error.value = null;
  };

  const clearSelectedUnit = () => {
    selectedUnit.value = null;
  };

  const clearSelection = () => {
    selectedFeatures.value.forEach(f => {
      const baseStyle = f.get('baseStyle');
      if (baseStyle) f.setStyle(baseStyle);
    });

    selectedFeatures.value = [];
    distance.value = null;
    error.value = null;
    selectedUnit.value = null;
  };

  const calculateDistance = (): void => {
    if (selectedFeatures.value.length === 2) {
      if (selectedFeatures.value[0] && selectedFeatures.value[1]) {
        const geometry1 = selectedFeatures.value[0].getGeometry();
        const geometry2 = selectedFeatures.value[1].getGeometry();
        if (geometry1 instanceof Point && geometry2 instanceof Point) {
          const coordinate1 = geometry1.getCoordinates();
          const coordinate2 = geometry2.getCoordinates();
          const lonLat1 = toLonLat(coordinate1);
          const lonLat2 = toLonLat(coordinate2);
          const distanceInMeters = getDistance(lonLat1, lonLat2);
          distance.value = distanceInMeters / 1000; 
        } else {
          distance.value = null;
        }
      }
    } else {
      distance.value = null;
    }
  };

  const setSelectedUnit = (feature: Feature<Point>): void => {
    const geom = feature.getGeometry();
    const coords = geom instanceof Point ? toLonLat(geom.getCoordinates()) : [0, 0];
    selectedUnit.value = {
      type: feature.get('type') || 'Unknown',
      callsign: feature.get('callsign') || 'N/A',
      position: `${coords[1]!.toFixed(7)}N, ${coords[0]!.toFixed(7)}E`,
      task: feature.get('task') || 'Idle',
      affiliation: feature.get('affiliation') || 'Unknown',
      speed: feature.get('speed') || 'Unknown',
      damage: feature.get('damage') || 'None',
      ammunition: feature.get('ammution') || 'Unknown',
    };
  };

  const unselectFeature = (feature: Feature<Point>) => {
    selectedFeatures.value = selectedFeatures.value.filter(f => f !== feature);

    if (
      selectedUnit.value &&
      selectedUnit.value.callsign === feature.get('callsign')
    ) {
      selectedUnit.value = null;
    }

    calculateDistance();
  };

  return {
    isOpen,
    selectedFeatures,
    distance,
    error,
    selectedUnit,
    toggleEditModal,
    addFeatureToSelection,
    removeSelected,
    clearSelection,
    clearSelectedUnit,
    setSelectedUnit,
    unselectFeature,
  };
});