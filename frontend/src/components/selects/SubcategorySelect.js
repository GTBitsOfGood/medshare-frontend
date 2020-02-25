import React from 'react';
import { Button, MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';

const subcategories = ['Gloves', 'Sterile', 'Isolation'];
const renderTag = subcategory => subcategory;

const ItemRenderer = (subcategory, { handleClick }) => {
  return <MenuItem key={subcategory} onClick={handleClick} text={subcategory} />;
};

const SubcategorySelect = () => {
  const handleClick = () => {};

  return (
    <MultiSelect items={subcategories} itemRenderer={ItemRenderer} onItemSelect={handleClick} tagRenderer={renderTag}>
      <Button text={subcategories} rightIcon="double-caret-vertical" />
    </MultiSelect>
  );
};

export default SubcategorySelect;
