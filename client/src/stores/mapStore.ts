import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { toLonLat } from 'ol/proj';
import { getDistance } from 'ol/sphere';
import type { Unit } from '@/types';
import type { Coordinate } from 'ol/coordinate';

export const useMapStore = defineStore('map', () => {
  const isOpen = ref<boolean>(false);
  const isMoveMode = ref<boolean>(false);
  const selectedFeatures = ref<Feature<Point>[]>([]);
  const distance = ref<number | null>(null);
  const error = ref<string | null>(null);
  const selectedUnit = ref<Unit | null>(null);

  const getLonLat = (feature: Feature<Point>): Coordinate | null => {
    const geometry = feature.getGeometry();
    if (!(geometry instanceof Point)) return null;
    return toLonLat(geometry.getCoordinates());
  };

  const calculateDistance = (): number | null => {
    if (selectedFeatures.value.length !== 2) return null;
    const [feature1, feature2] = selectedFeatures.value;

    if (!(feature1 instanceof Feature) || !(feature2 instanceof Feature)) return null;
    const coordinate1 = getLonLat(feature1);
    const coordinate2 = getLonLat(feature2);

    if (!coordinate1 || !coordinate2) return null;

    return getDistance(coordinate1, coordinate2) / 1000; 
  };

  const mapFeatureToUnit = (feature: Feature<Point>): Unit => {
    const coordinates = getLonLat(feature);

    const longitude = coordinates?.[0] ?? 0;
    const latitude = coordinates?.[1] ?? 0;

    return {
      type: feature.get('type') ?? 'Unknown',
      callsign: feature.get('callsign') ?? 'Unknown',
      position: `${latitude.toFixed(7)}N, ${longitude.toFixed(7)}E`,
      task: feature.get('task') ?? 'Idle',
      affiliation: feature.get('affiliation') ?? 'Unknown',
      speed: feature.get('speed') ?? 'Unknown',
      damage: feature.get('damage') ?? 'None',
      ammunition: feature.get('ammunition') ?? 'Unknown',
    };
  };

  const updateDistance = (): void => {
    distance.value = calculateDistance();
  };

  const toggleEditModal = (): void => {
    isOpen.value = !isOpen.value;
    if (!isOpen.value) clearSelection();
  };

  const enableMoveMode = (): void => {
    if (!selectedUnit.value) return;
    isMoveMode.value = true;
  };

  const disableMoveMode = (): void => {
    isMoveMode.value = false;
  };

  const addSelectedFeature = (feature: Feature<Point>): void => {
    error.value = null;

    if (selectedFeatures.value.includes(feature)) return;

    if (selectedFeatures.value.length >= 2) {
      error.value = 'Already 2 features selected. Unselect one to choose another.';
      return;
    }

    selectedFeatures.value.push(feature);
    updateDistance();
  };

  const removeFeature = (feature: Feature<Point>): void => {
    selectedFeatures.value = selectedFeatures.value.filter(selectedFeature => selectedFeature !== feature);

    if (selectedUnit.value?.callsign === feature.get('callsign')) {
      selectedUnit.value = null;
    }

    error.value = null;
    updateDistance();
  };

  const clearSelection = (): void => {
    selectedFeatures.value.forEach(selectedFeature => {
      const initialStyle = selectedFeature.get('initialStyle');
      if (initialStyle) selectedFeature.setStyle(initialStyle);
      selectedFeature.set('circleHighlight', false);
    });

    selectedFeatures.value = [];
    distance.value = null;
    error.value = null;
    selectedUnit.value = null;
  };

  const clearSelectedUnit = (): void => {
    selectedUnit.value = null;
  };

  const setSelectedUnit = (feature: Feature<Point>): void => {
    selectedUnit.value = mapFeatureToUnit(feature);
  };

  return {
    isOpen,
    isMoveMode,
    enableMoveMode,
    disableMoveMode,
    selectedFeatures,
    distance,
    error,
    selectedUnit,
    toggleEditModal,
    addSelectedFeature,
    removeFeature,
    clearSelection,
    clearSelectedUnit,
    setSelectedUnit,
  };
});