import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button, Tag } from '@blueprintjs/core';

const Text = styled.span`
  margin-bottom: 0.5rem;
  text-align: left;
`;

const OuterWrap = styled.div`
  font-size: 16px;
  display: flex;
  flex-direction: column;
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

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const InnerWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Star = styled(Button).attrs({
  minimal: true,
  className: 'bp3-minimal'
})`
  .bp3-icon {
    color: #ffbb1c;
  }
`;

const Product = props => {
  const { name, category, subcategory, productID, saved, onSaveClick } = props;
  return (
    <OuterWrap>
      <Text>{name}</Text>
      <Text>
        <b>Product ID: </b> {productID}
      </Text>
      <InnerWrap>
        <TagContainer>
          <Tag large round style={{ marginRight: '0.25rem', background: '#6396b3' }}>
            {category}
          </Tag>
          <Tag large round style={{ marginTop: '0.15rem', backgroundColor: '#D6A636' }}>
            {subcategory}
          </Tag>
        </TagContainer>
        <Star icon={saved ? 'star' : 'star-empty'} onClick={onSaveClick} />
      </InnerWrap>
    </OuterWrap>
  );
};

Product.propTypes = {
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  subcategory: PropTypes.string.isRequired,
  productID: PropTypes.string.isRequired,
  saved: PropTypes.bool.isRequired,
  onSaveClick: PropTypes.func.isRequired
};

export default memo(Product);
