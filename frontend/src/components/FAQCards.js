import React from 'react';
import styled from 'styled-components';
import { Card } from '@blueprintjs/core';

import FAQQuestion from './FAQQuestion';

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
`;

const FAQCards = () => {
  return (
    <Wrapper>
      <CardWrapper>
        <Card style={{ padding: '0rem' }}>
          <TextWrapper>
            <FAQQuestion question="How do I search for a product?" answer="answer1" />
            <FAQQuestion question="What features should I search for?" border answer="answer2" />
            <FAQQuestion question="What is the saved page?" border answer="answer3" />
            <FAQQuestion question="What is the yellow tag on each item?" border answer="answer4" />
            <FAQQuestion question="What do I do if my search yields no results?" border answer="answer5" />
          </TextWrapper>
        </Card>
      </CardWrapper>
    </Wrapper>
  );
};

export default FAQCards;
