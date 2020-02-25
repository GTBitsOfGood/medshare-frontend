import { useState } from 'react';
import { createContainer } from 'unstated-next';

const useFeaturesContainer = () => {
  const [selectedFeatures] = useState([]);
  const [featureResults] = useState([]);

  return {
    selectedFeatures,
    featureResults
  };
};

const FeaturesContainer = createContainer(useFeaturesContainer);
export default FeaturesContainer;
