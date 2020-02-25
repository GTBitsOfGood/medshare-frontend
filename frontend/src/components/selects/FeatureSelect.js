import React from 'react';
import styled from 'styled-components';
import { MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  flex-basis: 250px;
  flex-grow: 2;
`;

const tagRenderer = feature => feature.name;
const itemPredicate = (query, feature) => {
  const normalizedQuery = query.toLowerCase();
  const normalizedName = feature.name.toLowerCase();
  return normalizedName.indexOf(normalizedQuery) >= 0;
};
const renderFeature = (feature, { modifiers, handleClick }) => {
  return <MenuItem key={feature._id} onClick={handleClick} text={feature.name} active={modifiers.active} />;
};

const FeatureSelect = ({ selectedFeatures, featureResults, query, onQueryChange }) => {
  return (
    <Wrapper>
      <MultiSelect
        fill
        resetOnSelect
        query={query}
        onQueryChange={onQueryChange}
        selectedItems={selectedFeatures}
        items={featureResults}
        itemRenderer={renderFeature}
        itemPredicate={itemPredicate}
        tagRenderer={tagRenderer}
        popoverProps={{ minimal: true }}
        placeholder="Search..."
      />
    </Wrapper>
  );
};

FeatureSelect.propTypes = {
  selectedFeatures: PropTypes.arrayOf(PropTypes.any).isRequired,
  featureResults: PropTypes.arrayOf(PropTypes.any).isRequired,
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired
};

export default FeatureSelect;
