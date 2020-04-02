import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Button } from '@blueprintjs/core';
import FAQAnswers from './FAQAnswer';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const QuestionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1rem;
  border-top-style: ${props => (props.border ? 'solid' : 'none')};
  border-width: 1px;
  border-color: '#CCC9C9';
  background-color: ${props => (props.open ? '#f6f6f6' : '#ffffff')};
`;

const FAQQuestion = props => {
  const { question, border, answer } = props;

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Wrapper>
      <QuestionWrapper border={border} open={open}>
        <span style={{ marginRight: '0.75rem' }}>{question}</span>
        <Button className="bp3-minimal" onClick={handleClick} icon={open ? 'chevron-down' : 'chevron-right'} />
      </QuestionWrapper>
      <FAQAnswers isOpen={open} answer={answer} />
    </Wrapper>
  );
};

FAQQuestion.propTypes = {
  question: PropTypes.string.isRequired,
  border: PropTypes.bool,
  answer: PropTypes.string.isRequired
};
FAQQuestion.defaultProps = {
  border: false
};

export default FAQQuestion;
