import React from 'react';
import styled from 'styled-components';

import ProductList from './ProductList';
import QueryComponents from './QueryComponents';
import { deviceSize } from '../theme';
import CategoryContainer from '../containers/categoryContainer';
import FeaturesContainer from '../containers/featuresContainer';
import SubcategoriesContainer from '../containers/subcategoriesContainer';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 600px;
  margin: 2rem auto;

  @media ${deviceSize.laptop} {
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
    <CategoryContainer.Provider>
      <SubcategoriesContainer.Provider>
        <FeaturesContainer.Provider>
          <Wrapper>
            <QueryComponents />
            <ProductList searchResult={test} />
          </Wrapper>
        </FeaturesContainer.Provider>
      </SubcategoriesContainer.Provider>
    </CategoryContainer.Provider>
  );
};

export default RootPage;
