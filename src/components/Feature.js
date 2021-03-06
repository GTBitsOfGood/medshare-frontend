import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Tag } from '@blueprintjs/core';

const Wrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.25rem;
  cursor: pointer;
`;

const Feature = props => {
  const { name, onClick } = props;
  return (
    <Wrap>
      <Tag onClick={onClick} large round style={{ marginRight: '0.10rem', background: '#6396b3' }}>
        {name}
      </Tag>
    </Wrap>
  );
};

Feature.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Feature;
