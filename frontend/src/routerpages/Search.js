import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import NavBar from '../components/NavBar';
import ProductList from '../components/ProductList';
import QueryComponents from '../components/QueryComponents';
import { deviceSize } from '../theme';
import CategoryContainer from '../containers/categoryContainer';
import FeaturesContainer from '../containers/featuresContainer';
import SubcategoriesContainer from '../containers/subcategoriesContainer';
import FeatureList from '../components/FeatureList';

const NavBarWrapper = styled.div`
  @media ${deviceSize.mobileL} {
    width: 100vw;
  }
  @media ${deviceSize.mobileS} {
    width: 100vw;
  }
`;

const WidthMax = styled.div`
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

const Search = () => {
  return (
    <Providers>
      <NavBarWrapper>
        <NavBar />
      </NavBarWrapper>
      <WidthMax>
        <p style={{ color: '#706B6B', fontSize: '24px' }}>Search Tool</p>
        <QueryComponents />
        <FeatureList />
        <ProductList />
      </WidthMax>
    </Providers>
  );
};

export default Search;
