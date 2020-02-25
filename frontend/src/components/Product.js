import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Tag } from '@blueprintjs/core';

const Div = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #669eff;
  border: none;
  border-radius: 5px;
  color: white;
  padding: 0.5rem 1rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
`;
const TagContainer = styled.div``;

const Product = props => {
  const { name, category, subcategory } = props;
  return (
    <Div>
      <span>{name}</span>
      <TagContainer>
        <Tag style={{ marginRight: '0.25rem', backgroundColor: '#A82255' }}>{category}</Tag>
        <Tag style={{ backgroundColor: '#1D7324' }}>{subcategory}</Tag>
      </TagContainer>
    </Div>
  );
};

Product.propTypes = {
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  subcategory: PropTypes.string.isRequired
};

export default Product;