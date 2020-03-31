import React from 'react';
import styled from 'styled-components';

import Header from './Header';
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

const SearchPage = () => {
  return (
    <>
      <Header />
      <CategoryContainer.Provider>
        <SubcategoriesContainer.Provider>
          <FeaturesContainer.Provider>
            <Wrapper>
              <QueryComponents />
              <ProductList />
            </Wrapper>
          </FeaturesContainer.Provider>
        </SubcategoriesContainer.Provider>
      </CategoryContainer.Provider>
    </>
  );
};

export default SearchPage;
