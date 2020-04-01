import React from 'react';
import PropTypes from 'prop-types';

import { PageWrapper } from '../components/common';
import ProductList from '../components/ProductList';
import QueryComponents from '../components/QueryComponents';

import CategoryContainer from '../containers/categoryContainer';
import FeaturesContainer from '../containers/featuresContainer';
import SubcategoriesContainer from '../containers/subcategoriesContainer';
import FeatureList from '../components/FeatureList';

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
  children: PropTypes.node.isRequired
};

const Search = () => {
  return (
    <Providers>
      <PageWrapper>
        <p style={{ color: '#706B6B', fontSize: '24px' }}>Search Tool</p>
        <QueryComponents />
        <FeatureList />
        <ProductList />
      </PageWrapper>
    </Providers>
  );
};

export default Search;
