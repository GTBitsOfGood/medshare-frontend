import React from 'react';
import { Button, MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const MultiSelectWrapper = styled.div`
  flex-basis: 100px;
  flex-grow: 1;
`;

const subcategories = ['Gloves', 'Sterile', 'Isolation'];
const renderTag = subcategory => subcategory;

const itemPredicate = (query, name) => {
  const normalizedQuery = query.toLowerCase();
  const normalizedName = name.toLowerCase();
  return normalizedName.indexOf(normalizedQuery) >= 0;
};

const SubcategorySelect = ({ selectedItems, onRemoveByIdx, onSelect, onClear, checkIsSelected }) => {
  const renderItems = (item, { handleClick, modifiers }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        key={item}
        icon={checkIsSelected(item) ? 'tick' : 'blank'}
        onClick={handleClick}
        text={item}
        active={modifiers.active}
      />
    );
  };

  const clearButton = selectedItems.length > 0 ? <Button minimal icon="cross" onClick={onClear} /> : undefined;
  const handleRemove = (_, idx) => {
    onRemoveByIdx(idx);
  };

  return (
    <MultiSelectWrapper>
      <MultiSelect
        fill
        resetOnSelect
        popoverProps={{ minimal: true }}
        items={subcategories}
        itemRenderer={renderItems}
        itemPredicate={itemPredicate}
        onItemSelect={onSelect}
        noResults={<MenuItem disabled text="No results." />}
        tagRenderer={renderTag}
        tagInputProps={{ rightElement: clearButton, onRemove: handleRemove }}
        selectedItems={selectedItems}
        placeholder="Subcategories.."
      />
    </MultiSelectWrapper>
  );
};
SubcategorySelect.propTypes = {
  selectedItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClear: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onRemoveByIdx: PropTypes.func.isRequired,
  checkIsSelected: PropTypes.func.isRequired
};

export default SubcategorySelect;
