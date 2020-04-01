import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Collapse } from '@blueprintjs/core';

const Wrapper = styled.div`
  margin-bottom: 1rem;
  font-size: 14px;
  font-color: #706b6b;
  background-color: #f6f6f6;
`;

const FAQAnswers = props => {
  const { isOpen, answer } = props;
  return (
    <Wrapper>
      <Collapse isOpen={isOpen}>{answer}</Collapse>
    </Wrapper>
  );
};

FAQAnswers.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  answer: PropTypes.string.isRequired
};

export default FAQAnswers;
