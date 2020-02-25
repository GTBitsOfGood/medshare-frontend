import { useState } from 'react';
import { createContainer } from 'unstated-next';

const useFeaturesContainer = () => {
  const [query, setQuery] = useState('');
  const [selectedFeatures] = useState([]);
  const [featureResults, setFeatureResults] = useState([]);

  return {
    query,
    setQuery,
    selectedFeatures,
    featureResults,
    setFeatureResults
  };
};

const FeaturesContainer = createContainer(useFeaturesContainer);
export default FeaturesContainer;
