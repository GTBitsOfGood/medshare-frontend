import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Collapse } from '@blueprintjs/core';

const Wrapper = styled.div`
  font-size: 14px;
  font-color: #706b6b;
  background-color: #f6f6f6;
`;

const TextWrapper = styled.div`
  padding: 0.5rem;
`;

const FAQAnswers = props => {
  const { isOpen, answer } = props;
  return (
    <Wrapper>
      <Collapse isOpen={isOpen}>
        <TextWrapper>{answer}</TextWrapper>
      </Collapse>
    </Wrapper>
  );
};

FAQAnswers.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  answer: PropTypes.string.isRequired
};

export default FAQAnswers;
