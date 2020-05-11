import { useState } from 'react';
import { createContainer } from 'unstated-next';

const useFeaturesContainer = () => {
  const [query, setQuery] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [featureResults, setFeatureResults] = useState([]);

  const isFeatureSelected = feature => {
    return selectedFeatures.some(selectedFeauture => selectedFeauture._id === feature._id);
  };

  const handleFeatureSelect = feature => {
    if (!isFeatureSelected(feature)) {
      setSelectedFeatures(selectedFeatures.concat(feature));
    } else {
      removeFeature(feature);
    }
  };

  const clearFeatures = () => {
    setSelectedFeatures([]);
  };

  const removeFeature = featureName => {
    setSelectedFeatures(selectedFeatures.filter(feature => feature.name !== featureName));
  };

  return {
    query,
    setQuery,
    selectedFeatures,
    featureResults,
    setFeatureResults,
    removeFeature,
    handleFeatureSelect,
    clearFeatures,
    isFeatureSelected
  };
};

const FeaturesContainer = createContainer(useFeaturesContainer);
export default FeaturesContainer;
