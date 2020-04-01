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
  padding-top: 1.56rem;
  padding-bottom: 1.56rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-top-style: ${props => (props.border ? 'solid' : 'none')};
  border-width: 1px;
  border-color: '#CCC9C9';
  background-color: ${props => (props.color ? '#f6f6f6' : '#ffffff')};
`;

const FAQQuestion = props => {
  const { question, border, answer } = props;

  const [collapse, handleCollapse] = useState(false);
  const [caretIcon, changeCaret] = useState(true);
  const [background, changeColor] = useState(false);

  const handleClick = () => {
    handleCollapse(!collapse);
    changeCaret(!caretIcon);
    changeColor(!background);
  };

  return (
    <Wrapper>
      <QuestionWrapper border={border} color={background}>
        <span style={{ marginRight: '0.75rem' }}> {question}</span>
        <Button className="bp3-minimal" onClick={() => handleClick()} icon={caretIcon ? 'caret-right' : 'caret-down'} />
      </QuestionWrapper>
      <FAQAnswers isOpen={collapse} answer={answer} />
    </Wrapper>
  );
};

FAQQuestion.propTypes = {
  question: PropTypes.string.isRequired,
  border: PropTypes.bool.isRequired,
  answer: PropTypes.string.isRequired
};

export default FAQQuestion;
