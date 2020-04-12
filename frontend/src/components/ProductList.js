import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import CategoryContainer from '../containers/categoryContainer';
import SubcategoriesContainer from '../containers/subcategoriesContainer';
import FeaturesContainer from '../containers/featuresContainer';
import SavedProductsContainer from '../containers/savedProductsContainer';
import { getProductResults } from '../httpApi';
import { useDebounce } from '../utils';
import Product from './Product';

const ItemList = styled(InfiniteScroll)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const StyleWrapper = styled.div`
  margin-top: 0.5rem;
  text-align: right;
  width: 100%;
`;

const useProductsQuery = () => {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [count, setCount] = useState(0);
  const { category } = CategoryContainer.useContainer();
  const { selectedSubcats } = SubcategoriesContainer.useContainer();
  const { selectedFeatures, query } = FeaturesContainer.useContainer();
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    const filteredFeatureIds = selectedFeatures.map(feature => feature._id);
    getProductResults(debouncedQuery, filteredFeatureIds, category, selectedSubcats)
      .then(results => {
        if (results.data) {
          setHasMore(results.data.products.length === 15);
          setProducts(results.data.products);
          setCount(results.data.count || 0);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [debouncedQuery, selectedFeatures, category, selectedSubcats]);

  const fetchMore = () => {
    const filteredFeatureIds = selectedFeatures.map(feature => feature._id);
    const lastID = products[products.length - 1]._id;
    getProductResults(debouncedQuery, filteredFeatureIds, category, selectedSubcats, lastID)
      .then(results => {
        if (results.data) {
          const newList = products.concat(results.data.products);
          setHasMore(results.data.products.length === 15);
          setProducts(newList);
          setCount(results.data.count || 0);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  return [products, fetchMore, hasMore, count];
};

const ProductList = () => {
  const [products, fetchMore, hasMore, count] = useProductsQuery();
  const { isSaved, toggleProductSave } = SavedProductsContainer.useContainer();

  const handleSaveClick = product => () => {
    toggleProductSave(product);
  };

  return (
    <StyleWrapper>
      <p style={{ color: '#A9A7A7' }}>{count} Results</p>
      <ItemList
        dataLength={products.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>All results displayed.</b>
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
              saved={isSaved(product._id)}
              onSaveClick={handleSaveClick(product)}
            />
          );
        })}
      </ItemList>
    </StyleWrapper>
  );
};

export default ProductList;
