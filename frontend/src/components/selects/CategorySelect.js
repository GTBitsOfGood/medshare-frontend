import React from 'react';
import { Menu, Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import deselectButton from '../../resources/deselect.png';

const SelectContainer = styled.div``;

const categories = ['Medical Equipment', 'World Vision', 'Bio Med', 'Kendall'];

let active = '';

const SelectedItem = props => {
  const { deselectFunc } = props;
  return (
    <div>
      <button type="submit" onClick={deselectFunc}>
        <img alt="deselect button" src={deselectButton} height="15" width="15" />
      </button>
    </div>
  );
};

SelectedItem.propTypes = {
  deselectFunc: PropTypes.func.isRequired
};

const itemListRenderer = ({ items, itemsParentRef, renderItem, activeItem }) => {
  const renderedItems = items.map(renderItem).filter(item => item.props.text !== activeItem);
  const deselectActive = () => {
    active = '';
    activeItem = active;
    console.log('function??');
  };
  return (
    <Menu ulRef={itemsParentRef}>
      <MenuItem
        key={activeItem}
        text={activeItem}
        labelElement={activeItem === '' ? null : <SelectedItem deselectFunc={deselectActive} />}
        shouldDismissPopover={false}
      />
      {renderedItems}
    </Menu>
  );
};

itemListRenderer.propTypes = {
  items: PropTypes.shape.isRequired,
  itemsParentRef: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  activeItem: PropTypes.string.isRequired
};

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

const CategorySelect = ({ onSelect, category }) => {
  onSelect(active);
  const selectItem = item => {
    onSelect(item);
    active = item;
  };
  console.log(active);
  console.log('c: ' + category);
  return (
    <SelectContainer>
      <Select
        fill
        filterable={false}
        popoverProps={{ minimal: true }}
        items={categories}
        itemListRenderer={itemListRenderer}
        itemRenderer={itemRenderer}
        onItemSelect={selectItem}
        activeItem={category}
      >
        <Button text={category || 'Category'} rightIcon="caret-down" />
      </Select>
    </SelectContainer>
  );
};
CategorySelect.propTypes = {
  category: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default CategorySelect;
