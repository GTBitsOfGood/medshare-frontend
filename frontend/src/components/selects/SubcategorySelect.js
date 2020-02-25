import React, { useState } from 'react';
import { Button, MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';
import styled from 'styled-components';

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

const useItems = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const isItemSelected = item => {
    return selectedItems.indexOf(item) >= 0;
  };
  const selectItem = item => {
    setSelectedItems(selectedItems.concat(item));
  };
  const removeItemByIdx = idxToRemove => {
    setSelectedItems(selectedItems.filter((item, idx) => idx !== idxToRemove));
  };
  const handleItemSelect = item => {
    if (!isItemSelected(item)) {
      selectItem(item);
    } else {
      removeItemByIdx(selectedItems.indexOf(item));
    }
  };
  const clearItems = () => {
    setSelectedItems([]);
  };
  const handleItemRemove = (_, idx) => {
    removeItemByIdx(idx);
  };
  const renderItems = (item, { handleClick, modifiers }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        key={item}
        icon={isItemSelected(item) ? 'tick' : 'blank'}
        onClick={handleClick}
        text={item}
        active={modifiers.active}
      />
    );
  };

  return {
    selectedItems,
    handleItemSelect,
    handleItemRemove,
    clearItems,
    renderItems
  };
};

const SubcategorySelect = () => {
  const { selectedItems, handleItemSelect, clearItems, handleItemRemove, renderItems } = useItems();

  const clearButton = selectedItems.length > 0 ? <Button minimal icon="cross" onClick={clearItems} /> : undefined;

  return (
    <MultiSelectWrapper>
      <MultiSelect
        fill
        resetOnSelect
        popoverProps={{ minimal: true }}
        items={subcategories}
        itemRenderer={renderItems}
        itemPredicate={itemPredicate}
        onItemSelect={handleItemSelect}
        noResults={<MenuItem disabled text="No results." />}
        tagRenderer={renderTag}
        tagInputProps={{ rightElement: clearButton, onRemove: handleItemRemove }}
        selectedItems={selectedItems}
        placeholder="Subcategories.."
      />
    </MultiSelectWrapper>
  );
};

export default SubcategorySelect;
