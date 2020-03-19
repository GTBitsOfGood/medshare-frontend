import React from 'react';
import styled from 'styled-components';
import { MenuItem, Button, Menu } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  width: 100%;
  flex-grow: 2;
  color: black;

  .bp3-input {
    box-shadow: 0 0 0 0 #6396b3, 0 0 0 0 #6396b3, inset 0 0 0 1px #6396b3, inset 0 1px 1px #6396b3;
  }
`;

const tagRenderer = feature => feature.name;
const itemPredicate = (query, feature) => {
  const normalizedQuery = query.toLowerCase();
  const normalizedName = feature.name.toLowerCase();
  return normalizedName.indexOf(normalizedQuery) >= 0;
};

const itemListRenderer = ({ renderItem, items, itemsParentRef }) => {
  return (
    <Menu large ulRef={itemsParentRef}>
      {items.map(renderItem)}
    </Menu>
  );
};
itemListRenderer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  itemsParentRef: PropTypes.element.isRequired,
  renderItem: PropTypes.func.isRequired
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
        itemListRenderer={itemListRenderer}
        itemRenderer={renderFeature}
        itemPredicate={itemPredicate}
        tagRenderer={tagRenderer}
        tagInputProps={{ onRemove, rightElement: clearButton, large: true }}
        popoverProps={{ minimal: true }}
        placeholder="Search Features..."
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
