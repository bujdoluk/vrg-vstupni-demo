import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { toLonLat } from 'ol/proj';
import { getDistance } from 'ol/sphere';

export const useMapStore = defineStore('map', () => {
  const isEditModalOpen = ref(false);
  const selectedFeatures = ref<Feature<Point>[]>([]);
  const distance = ref<number | null>(null);
  const selectionError = ref<string | null>(null);

  // Unit info
  const selectedUnit = ref<{
    type: string;
    callsign: string;
    position: string;
    task: string;
  } | null>(null);

  const toggleEditModal = () => {
    isEditModalOpen.value = !isEditModalOpen.value;
    if (!isEditModalOpen.value) clearSelection();
  };

  // Add feature to distance selection
  const addFeatureToSelection = (feature: Feature<Point>) => {
    selectionError.value = null;

    if (selectedFeatures.value.includes(feature)) return;

    if (selectedFeatures.value.length >= 2) {
      selectionError.value =
        'Already 2 features selected. Unselect one to choose another.';
      return;
    }

    selectedFeatures.value.push(feature);
    computeDistance();
  };

  // Remove feature from selection
  const removeFeatureFromSelection = (feature: Feature<Point>) => {
    selectedFeatures.value = selectedFeatures.value.filter(f => f !== feature);
    computeDistance();
    selectionError.value = null;
  };

  // Clear all selections & highlight
  const clearSelection = () => {
    selectedFeatures.value.forEach(f => {
      const baseStyle = f.get('baseStyle');
      if (baseStyle) f.setStyle(baseStyle);
    });

    selectedFeatures.value = [];
    distance.value = null;
    selectionError.value = null;
    selectedUnit.value = null;
  };

  // Compute geodesic distance in km
  const computeDistance = () => {
    if (selectedFeatures.value.length === 2) {
      const geom1 = selectedFeatures.value[0]!.getGeometry();
      const geom2 = selectedFeatures.value[1]!.getGeometry();
      if (geom1 instanceof Point && geom2 instanceof Point) {
        const coords1 = geom1.getCoordinates();
        const coords2 = geom2.getCoordinates();
        const lonLat1 = toLonLat(coords1);
        const lonLat2 = toLonLat(coords2);
        const distanceMeters = getDistance(lonLat1, lonLat2);
        distance.value = distanceMeters / 1000; // km
      } else {
        distance.value = null;
      }
    } else {
      distance.value = null;
    }
  };

  // Set selected unit info
  const setSelectedUnit = (feature: Feature<Point>) => {
    const geom = feature.getGeometry();
    const coords = geom instanceof Point ? toLonLat(geom.getCoordinates()) : [0, 0];
    selectedUnit.value = {
      type: feature.get('type') || 'Unknown',
      callsign: feature.get('callsign') || 'N/A',
      position: `${coords[1]!.toFixed(7)}N, ${coords[0]!.toFixed(7)}E`,
      task: feature.get('task') || 'Idle',
    };
  };

  // Unselect a unit feature
  const unselectFeature = (feature: Feature<Point>) => {
    selectedFeatures.value = selectedFeatures.value.filter(f => f !== feature);

    if (
      selectedUnit.value &&
      selectedUnit.value.callsign === feature.get('callsign')
    ) {
      selectedUnit.value = null;
    }

    computeDistance();
  };

  return {
    isEditModalOpen,
    selectedFeatures,
    distance,
    selectionError,
    selectedUnit,
    toggleEditModal,
    addFeatureToSelection,
    removeFeatureFromSelection,
    clearSelection,
    setSelectedUnit,
    unselectFeature,
  };
});