import React from 'react';
import styled from 'styled-components';
import ProductList from './ProductList';
import CategorySelect from './selects/CategorySelect';
import { deviceSize } from '../theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media ${deviceSize.laptop} {
    margin: 2rem 6rem;
  }
`;

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

const RootPage = () => {
  return (
    <Container>
      <CategorySelect />
      <ProductList searchResult={test} />
    </Container>
  );
};

export default RootPage;
