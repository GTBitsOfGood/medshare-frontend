import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import CategoryContainer from '../containers/categoryContainer';
import SubcategoriesContainer from '../containers/subcategoriesContainer';
import FeaturesContainer from '../containers/featuresContainer';
import { getProductResults } from '../httpApi';
import { useDebounce } from '../utils';
import Product from './Product';

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 1rem;
`;

const useProductsQuery = () => {
  const [products, setProducts] = useState([]);
  const { category } = CategoryContainer.useContainer();
  const { selectedSubcats } = SubcategoriesContainer.useContainer();
  const { selectedFeatures, query } = FeaturesContainer.useContainer();

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    const filteredFeatureIds = selectedFeatures.map(feature => feature._id);

    getProductResults(debouncedQuery, filteredFeatureIds, category, selectedSubcats)
      .then(results => {
        setProducts(results.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [debouncedQuery, selectedFeatures, category, selectedSubcats]);
  return products;
};

const ProductList = () => {
  const products = useProductsQuery();
  return (
    <ItemList>
      {products.map(product => {
        return (
          <Product
            key={product._id}
            name={product.name}
            category={product.category}
            subcategory={product.subcategory}
            productID={product.productId}
          />
        );
      })}
    </ItemList>
  );
};

export default ProductList;
