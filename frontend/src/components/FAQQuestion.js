import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Icon } from '@blueprintjs/core';
import FAQAnswers from './FAQAnswer';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-top-style: solid;
  border-width: 1px;
  border-color: '#CCC9C9';
  background-color: ${props => (props.open ? '#f6f6f6' : '#ffffff')};

  &:first-child {
    border-top-style: none;
  }
`;

const QuestionWrapper = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1rem;
`;

const FAQQuestion = props => {
  const { question, answer } = props;

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Wrapper open={open}>
      <QuestionWrapper onClick={handleClick}>
        <span style={{ marginRight: '0.75rem' }}>{question}</span>
        <Icon icon={open ? 'chevron-down' : 'chevron-right'} />
      </QuestionWrapper>
      <FAQAnswers isOpen={open} answer={answer} />
    </Wrapper>
  );
};

FAQQuestion.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired
};

export default FAQQuestion;
