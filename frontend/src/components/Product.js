import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Tag } from '@blueprintjs/core';

const Div = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #ccc9c9;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  color: black;
  padding: 0.5rem 1rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
`;
const TagContainer = styled.div``;

const Product = props => {
  const { name, category, subcategory, productid } = props;
  return (
    <Div>
      <span>{name}</span>
      <TagContainer>
        <Tag round style={{ marginRight: '0.25rem', background: '##6396b3' }}>
          {category}
        </Tag>
        <Tag round style={{ backgroundColor: '#D6A636' }}>
          {subcategory}
        </Tag>
      </TagContainer>
      <text>
        <b>SKU:</b> {productid}
      </text>
    </Div>
  );
};

Product.propTypes = {
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  subcategory: PropTypes.string.isRequired,
  productid: PropTypes.string.isRequired
};

export default Product;
