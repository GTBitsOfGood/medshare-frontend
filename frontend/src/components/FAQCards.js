import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Collapse } from '@blueprintjs/core';

const Wrapper = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const CardWrapper = styled.div`
  box-shadow: 4px;
  border: 1px solid '#ccc9c9';
`;

const TextWrapper = styled.div`
  font-size: 18px;
  color: #706b6b;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const TopQuestionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.13rem;
  padding-bottom: 1.56rem;
  font-size: 18px;
`;

const QuestionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.56rem;
  padding-bottom: 1.56rem;
  border-top-style: solid;
  border-width: 1px;
  border-color: '#CCC9C9';
  font-size: 18px;
`;

const FAQCards = () => {
  const [collapse, handleCollapse] = useState(false);

  return (
    <Wrapper>
      <CardWrapper>
        <Card>
          <TextWrapper>
            <TopQuestionWrapper>
              <span style={{ marginRight: '0.75rem' }}>How do I search for a product?</span>
              <Button className="bp3-minimal" icon="caret-right" onClick={() => handleCollapse(true)} />
              <Collapse isOpen={collapse}> Hello</Collapse>
            </TopQuestionWrapper>
            <QuestionWrapper>
              <span style={{ marginRight: '0.75rem' }}>What features should I search for?</span>
              <Button className="bp3-minimal" icon="caret-right" onClick={() => handleCollapse(true)} />
            </QuestionWrapper>
            <QuestionWrapper>
              <span style={{ marginRight: '0.75rem' }}>What is the saved page?</span>
              <Button className="bp3-minimal" icon="caret-right" onClick={() => handleCollapse(true)} />
            </QuestionWrapper>
            <QuestionWrapper>
              <span style={{ marginRight: '0.75rem' }}>What is the yellow tag on each item?</span>
              <Button className="bp3-minimal" icon="caret-right" onClick={() => handleCollapse(true)} />
            </QuestionWrapper>
            <QuestionWrapper>
              <span style={{ marginRight: '0.75rem' }}>What do I do if my search yields no results?</span>
              <Button className="bp3-minimal" icon="caret-right" onClick={() => handleCollapse(true)} />
            </QuestionWrapper>
          </TextWrapper>
        </Card>
      </CardWrapper>
    </Wrapper>
  );
};

export default FAQCards;
