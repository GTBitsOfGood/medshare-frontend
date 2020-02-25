import React from 'react';
import { Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

const categories = ['Medical Equipment', 'World Vision', 'Bio Med', 'Kendall'];

const ItemRenderer = (category, { handleClick }) => {
  return <MenuItem key={category} onClick={handleClick} text={category} />;
};

class Home extends React.Component {
  render() {
    return (
      <Select
        items={categories}
        itemRenderer={ItemRenderer}
        onItemSelect={this.handleClick}
      >
        <Button text={categories} rightIcon="double-caret-vertical" />
      </Select>
    );
  }
}
export default Home;
