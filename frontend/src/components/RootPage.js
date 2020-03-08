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
  max-width: 500px;
  margin: 2rem auto;

  @media ${deviceSize.laptop} {
    max-width: 500px;
  }
  @media ${deviceSize.mobileL} {
    max-width: 350px;
  }
  @media ${deviceSize.mobileS} {
    max-width: 300px;
  }
`;

const RootPage = () => {
  return (
    <Wrapper>
      <CategoryContainer.Provider>
        <SubcategoriesContainer.Provider>
          <FeaturesContainer.Provider>
            <QueryComponents />
            <ProductList />
          </FeaturesContainer.Provider>
        </SubcategoriesContainer.Provider>
      </CategoryContainer.Provider>
    </Wrapper>
  );
};

export default RootPage;
