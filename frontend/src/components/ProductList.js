import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Product from './Product';

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 20px auto;
  width: 60%;
`;

const ProductList = props => {
  const { searchResult } = props;
  return (
    <div>
      <ItemList>
        {Object.keys(searchResult).map(index => {
          return (
            <Product
              name={searchResult[index].name}
              category={searchResult[index].category}
              subcategory={searchResult[index].subcategory}
            />
          );
        })}
      </ItemList>
    </div>
  );
};

ProductList.propTypes = {
  searchResult: PropTypes.shape.isRequired
};

export default ProductList;
