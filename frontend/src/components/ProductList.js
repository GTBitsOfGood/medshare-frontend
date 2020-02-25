import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Product from './Product';

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  width: 100%;
  margin-top: 2.5rem;
`;

const ProductList = props => {
  const { searchResult } = props;
  return (
    <ItemList>
      {searchResult.map(product => {
        return (
          <Product
            key={product._id}
            name={product.name}
            category={product.category}
            subcategory={product.subcategory}
          />
        );
      })}
    </ItemList>
  );
};

ProductList.propTypes = {
  searchResult: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      subcategory: PropTypes.string.isRequired
    })
  )
};
ProductList.defaultProps = {
  searchResult: []
};

export default ProductList;
