import React from 'react';
import { Menu, Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SelectContainer = styled.div``;

const categories = ['Medical Equipment', 'World Vision', 'Bio Med', 'Kendall'];

const CategorySelect = ({ onSelect, category }) => {
  const deselectActive = () => {
    onSelect('');
  };

  const itemListRenderer = ({ items, itemsParentRef, renderItem, activeItem }) => {
    const renderedItems = items.map(item => {
      if (item === activeItem) {
        return (
          <MenuItem
            active
            key={activeItem}
            text={activeItem}
            labelElement={<Button small icon="cross" type="submit" onClick={deselectActive} intent="danger" />}
            shouldDismissPopover={false}
          />
        );
      }
      return renderItem(item);
    });
    return <Menu ulRef={itemsParentRef}>{renderedItems}</Menu>;
  };

  itemListRenderer.propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
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
