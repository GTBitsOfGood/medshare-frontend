import React from 'react';
import styled from 'styled-components';
import { MenuItem, Button } from '@blueprintjs/core';
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

const FeatureSelect = ({
  selectedFeatures,
  featureResults,
  query,
  onQueryChange,
  onRemove,
  onClear,
  onSelect,
  checkIsFeatureSelected
}) => {
  const clearButton = selectedFeatures.length > 0 ? <Button minimal icon="cross" onClick={onClear} /> : undefined;
  const renderFeature = (feature, { modifiers, handleClick }) => {
    return (
      <MenuItem
        key={feature._id}
        icon={checkIsFeatureSelected(feature) ? 'tick' : 'blank'}
        onClick={handleClick}
        text={feature.name}
        active={modifiers.active}
      />
    );
  };

  return (
    <Wrapper>
      <MultiSelect
        fill
        resetOnSelect
        query={query}
        onItemSelect={onSelect}
        onQueryChange={onQueryChange}
        selectedItems={selectedFeatures}
        items={featureResults}
        itemRenderer={renderFeature}
        itemPredicate={itemPredicate}
        tagRenderer={tagRenderer}
        tagInputProps={{ onRemove, rightElement: clearButton }}
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
  onQueryChange: PropTypes.func.isRequired,
  checkIsFeatureSelected: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default FeatureSelect;
