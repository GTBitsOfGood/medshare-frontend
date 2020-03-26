import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import FeaturesContainer from '../containers/featuresContainer';
import { getFrequentFeatures } from '../httpApi';
import Feature from './Feature';

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  text-align: left;
`;

const TagContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
`;

const useFrequentFeatures = () => {
  const [features, setFeatures] = useState([]);
  useEffect(() => {
    getFrequentFeatures()
      .then(results => {
        setFeatures(results.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  return features;
};

// Only displayed at the start when no Features have been selected
const FeatureList = () => {
  const features = useFrequentFeatures();
  const [showFeatures, setShowFeatures] = useState(true);
  const { selectedFeatures } = FeaturesContainer.useContainer();
  useEffect(() => {
    if (selectedFeatures.length > 0) {
      setShowFeatures(false);
    }
  }, [selectedFeatures]);

  if (!showFeatures) {
    return null;
  }

  return (
    <ItemList>
      <p style={{ color: '#A9A7A7' }}>Frequent Features</p>
      <TagContainer>
        {features.map(feature => {
          return <Feature key={feature._id} name={feature.name} />;
        })}
      </TagContainer>
    </ItemList>
  );
};

export default FeatureList;
