import React, { useState } from 'react';
import { Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

const categories = ['Medical Equipment', 'World Vision', 'Bio Med', 'Kendall'];

const itemRenderer = (category, { index, handleClick, modifiers }) => {
  return (
    <MenuItem
      key={index + category}
      onClick={handleClick}
      text={category}
      active={modifiers.active}
      shouldDismissPopover={false}
    />
  );
};

const CategorySelect = () => {
  const [category, setCategory] = useState(null);
  const handleSelect = selectedCategory => {
    setCategory(selectedCategory);
  };

  return (
    <Select
      filterable={false}
      popoverProps={{ minimal: true }}
      items={categories}
      itemRenderer={itemRenderer}
      onItemSelect={handleSelect}
    >
      <Button text={category || 'Select Category'} rightIcon="caret-down" />
    </Select>
  );
};

export default CategorySelect;
