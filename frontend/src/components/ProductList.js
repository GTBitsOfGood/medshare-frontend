import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import CategoryContainer from '../containers/categoryContainer';
import SubcategoriesContainer from '../containers/subcategoriesContainer';
import FeaturesContainer from '../containers/featuresContainer';
import { getProductResults } from '../httpApi';
import { useDebounce } from '../utils';
import Product from './Product';

const ItemList = styled(InfiniteScroll)`
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
        if (results.data) {
          setProducts(results.data.products);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [debouncedQuery, selectedFeatures, category, selectedSubcats]);
  return products;
};

const fetchMore = () => {
  // add more search results to product
  return null;
};

const ProductList = () => {
  const products = useProductsQuery();
  return (
    <ItemList
      dataLength={products.length}
      next={fetchMore}
      hasMore
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
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
