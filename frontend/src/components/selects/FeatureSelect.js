import React from 'react';
import styled from 'styled-components';
import { MultiSelect } from '@blueprintjs/select';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  flex-basis: 250px;
  flex-grow: 2;
`;

const tagRenderer = feature => feature.name;

const FeatureSelect = ({ selectedFeatures, featureResults }) => {
  return (
    <Wrapper>
      <MultiSelect
        fill
        resetOnSelect
        selectedItems={selectedFeatures}
        items={featureResults}
        tagRenderer={tagRenderer}
        popoverProps={{ minimal: true }}
        placeholder="Search..."
      />
    </Wrapper>
  );
};

FeatureSelect.propTypes = {
  selectedFeatures: PropTypes.arrayOf(PropTypes.any).isRequired,
  featureResults: PropTypes.arrayOf(PropTypes.any).isRequired
};

export default FeatureSelect;
