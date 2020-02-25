import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Tag } from '@blueprintjs/core';

const Div = styled.div`
  display: block;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  color: white;
  padding: 16px 32px;
  text-decoration: none;
  margin: 4px 2px;
  cursor: pointer;
`;

const Product = props => {
  const { name, category, subcategory } = props;
  return (
    <Div>
      <span style={{ display: 'inline-block', width: '33%' }}>{name}</span>
      <Tag style={{ display: 'inline-block', width: '33%' }}>{category}</Tag>
      <Tag style={{ display: 'inline-block', width: '33%' }}>{subcategory}</Tag>
    </Div>
  );
};

Product.propTypes = {
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  subcategory: PropTypes.string.isRequired
};

export default Product;
