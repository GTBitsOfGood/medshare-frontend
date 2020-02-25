import React from 'react';
import { Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SelectContainer = styled.div``;

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

const CategorySelect = ({ handleSelect, category }) => {
  return (
    <SelectContainer>
      <Select
        fill
        filterable={false}
        popoverProps={{ minimal: true }}
        items={categories}
        itemRenderer={itemRenderer}
        onItemSelect={handleSelect}
      >
        <Button text={category || 'Category'} rightIcon="caret-down" />
      </Select>
    </SelectContainer>
  );
};
CategorySelect.propTypes = {
  category: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired
};

export default CategorySelect;
