import React from 'react';
import ProductList from './ProductList';

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
        <ProductList searchResult={test} />
      </div>
    );
  }
}
export default Home;
