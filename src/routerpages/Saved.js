import React, { memo } from 'react';
import styled from 'styled-components';
import { PageWrapper } from '../components/common';
import SavedProductsContainer from '../containers/savedProductsContainer';

import Product from '../components/Product';

const ListWrapper = styled.div`
  width: 100%;
  margin-top: 0.5rem;
`;

const SavedProductsPage = () => {
  const { savedProducts, removeSavedProduct } = SavedProductsContainer.useContainer();

  const products = Object.values(savedProducts);

  const handleSaveClick = documentId => () => {
    removeSavedProduct(documentId);
  };

  return (
    <PageWrapper>
      <p style={{ color: '#706B6B', fontSize: '24px' }}>Saved Products</p>
      {products.length ? (
        <ListWrapper>
          <p style={{ color: '#A9A7A7', textAlign: 'right' }}>{products.length} Results</p>
          {products.map(product => (
            <Product
              saved
              key={product._id}
              name={product.name}
              category={product.category}
              subcategory={product.subcategory}
              productID={product.productId}
              onSaveClick={handleSaveClick(product._id)}
            />
          ))}
        </ListWrapper>
      ) : (
        <p style={{ marginTop: '1rem', fontSize: '16px', fontStyle: 'italic' }}>No saved products</p>
      )}
    </PageWrapper>
  );
};
export default memo(SavedProductsPage);
