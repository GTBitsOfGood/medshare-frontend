import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Header from './Header';
import ProductList from './ProductList';
import QueryComponents from './QueryComponents';
import { deviceSize } from '../theme';
import CategoryContainer from '../containers/categoryContainer';
import FeaturesContainer from '../containers/featuresContainer';
import SubcategoriesContainer from '../containers/subcategoriesContainer';
import FeatureList from './FeatureList';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;

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

const Providers = ({ children }) => {
  return (
    <CategoryContainer.Provider>
      <SubcategoriesContainer.Provider>
        <FeaturesContainer.Provider>{children}</FeaturesContainer.Provider>
      </SubcategoriesContainer.Provider>
    </CategoryContainer.Provider>
  );
};
Providers.propTypes = {
  children: PropTypes.element.isRequired
};

const RootPage = () => {
  return (
    <Providers>
      <Header />
      <Wrapper>
        <QueryComponents />
        <FeatureList />
        <ProductList />
      </Wrapper>
    </Providers>
  );
};

export default RootPage;
