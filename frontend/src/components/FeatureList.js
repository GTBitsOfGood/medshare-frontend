import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
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

const FeatureList = () => {
  const features = useFrequentFeatures();
  return (
    <ItemList>
      <p style={{ color: '#A9A7A7' }}>Frequent Filters </p>
      <TagContainer>
        {features.map(feature => {
          return <Feature key={feature._id} name={feature.name} />;
        })}
      </TagContainer>
    </ItemList>
  );
};

export default FeatureList;
