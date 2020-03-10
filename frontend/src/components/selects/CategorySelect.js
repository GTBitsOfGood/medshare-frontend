import React from 'react';
import { Menu, Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import deselectButton from '../../resources/deselect.png';

const SelectContainer = styled.div``;

const ButtonWithBorder = styled.button`
  display: block;
  border-radius: 8px;
  color: white;
  background-color: white;
  cursor: pointer;
  margin-top: 2px;
`;

const categories = ['Medical Equipment', 'World Vision', 'Bio Med', 'Kendall'];

const CategorySelect = ({ onSelect, category }) => {
  const deselectActive = () => {
    onSelect('');
  };
  const SelectedItem = () => {
    return (
      <div>
        <ButtonWithBorder type="submit" onClick={deselectActive}>
          <img alt="deselect button" src={deselectButton} height="15" width="15" />
        </ButtonWithBorder>
      </div>
    );
  };

  const itemListRenderer = ({ items, itemsParentRef, renderItem, activeItem }) => {
    const renderedItems = items.map(item => {
      if (item === activeItem) {
        return (
          <MenuItem key={activeItem} text={activeItem} labelElement={<SelectedItem />} shouldDismissPopover={false} />
        );
      }
      return renderItem(item);
    });
    return <Menu ulRef={itemsParentRef}>{renderedItems}</Menu>;
  };

  itemListRenderer.propTypes = {
    items: PropTypes.shape.isRequired,
    itemsParentRef: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired,
    activeItem: PropTypes.string.isRequired
  };

  const itemRenderer = (cate, { index, handleClick, modifiers }) => {
    return (
      <MenuItem
        key={index + cate}
        onClick={handleClick}
        text={cate}
        active={modifiers.active}
        shouldDismissPopover={false}
      />
    );
  };
  return (
    <SelectContainer>
      <Select
        fill
        filterable={false}
        popoverProps={{ minimal: true }}
        items={categories}
        itemListRenderer={itemListRenderer}
        itemRenderer={itemRenderer}
        onItemSelect={onSelect}
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
