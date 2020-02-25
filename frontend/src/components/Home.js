import React from 'react';
import { Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import ProductList from './ProductList';

const categories = ['Medical Equipment', 'World Vision', 'Bio Med', 'Kendall'];

const ItemRenderer = (category, { handleClick }) => {
  return <MenuItem key={category} onClick={handleClick} text={category} />;
};

const test = [
  {
    _id: '5e49c6e0f454878ce41bfa5c',
    features: [],
    name: 'hand',
    category: 'Greasy',
    subcategory: 'Huge',
    productId: '783465',
    __v: 0
  },
  {
    _id: '5e49c6e0f454878ce41bfa5d',
    features: [],
    name: 'hand',
    category: 'Greasy',
    subcategory: 'Huge',
    productId: '783465',
    __v: 0
  },
  {
    _id: '5e49c6e1f454878ce41bfa5e',
    features: [],
    name: 'hand',
    category: 'Greasy',
    subcategory: 'Huge',
    productId: '783465',
    __v: 0
  },
  {
    _id: '5e49c6e1f454878ce41bfa5f',
    features: [],
    name: 'hand',
    category: 'Greasy',
    subcategory: 'Huge',
    productId: '783465',
    __v: 0
  }
];
class Home extends React.Component {
  render() {
    return (
      <div>
        <Select items={categories} itemRenderer={ItemRenderer} onItemSelect={this.handleClick}>
          <Button text={categories} rightIcon="double-caret-vertical" />
        </Select>
        <ProductList searchResult={test} />
      </div>
    );
  }
}
export default Home;
