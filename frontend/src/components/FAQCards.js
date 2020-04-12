import React from 'react';
import styled from 'styled-components';
import { Card } from '@blueprintjs/core';

import FAQQuestion from './FAQQuestion';

const faqItems = [
  {
    question: 'What can I do with this search tool?',
    answer: `This search tool lets you look up the Product ID's of items using its category, subcategory, or any part of its name. You can also reverse look up products with their Product IDs; just enter the Product ID in the "Search features..." searchbar. For frequently accessed items, you can save items by pressing the star button on the right hand side of the product entry and view all saved items in the Saved portal, accessible from the hamburger menu in the top left.`
  },
  {
    question: 'I have a product. How do I start looking for it?',
    answer: `If you happen to know the category/subcategory, start by entering those in their respective fields. If not, don't worry! Get started by typing in features of the item you have at hand (in any order) in the "Search features..." searchbar and/or selecting them from the suggestions/frequent filters as they come.`
  },
  {
    question: 'What are the categories and subcategories?',
    answer: `Categories refer to specific conventions about how the Product ID's are formatted. You won't need to worry about those unless you've been explicitly told to. Subcategories are more helpful and used more often - what goes in each subcategory can be found in the posters on the walls in the warehouse, though those aren't always easy to identify. That's why we didn't make either (category or subcategory) required in order to perform a search.`
  },
  {
    question: 'What do the tags on the products mean?',
    answer: `The first tag (bluish gray) is the item's category, and the second tag (yellow) is its subcategory.`
  },
  {
    question: "How do I access the products I've saved?",
    answer: 'Press the hamburger menu (the 3 horizontal buttons) and press on the "Saved Products" tab.'
  },
  {
    question: 'How does the search tool handle typos?',
    answer: `It doesn't (intentionally); we decided that the ability to recognize differences between plural and singular forms of a word trumped the benefits of fuzzy search. For example, "gloves" (package of gloves) should be different from "glove" (loose, individual gloves). Fuzzy search would have rendered such distinctions impossible.`
  },
  {
    question: "There's a product entry that is incorrect / not listed! What should I do?",
    answer: `Check that you've entered all terms correctly and try using different search terms. If you still can't find the product, contact the admins, who have the ability to update the data.`
  },
  {
    question: 'Who should I contact for technical inquiries and feedback?',
    answer:
      'Please contact the Product Manager for this project, Raymond Zhu, at rayzhu one two at gmail dot com. Be sure to copy product@bitsofgood.org and include an explanation of the issue and screenshots (if applicable/possible)! We will get in touch with you as soon as we can.'
  }
];

const Wrapper = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  box-shadow: 4px;
  border: 1px solid '#ccc9c9';
`;

const CardWrapper = styled(Card)`
  font-size: 18px;
  color: #706b6b;
  display: flex;
  flex-direction: column;
  padding: 0rem;
`;

const FAQCards = () => {
  return (
    <Wrapper>
      <CardWrapper>
        {faqItems.map(({ question, answer }, idx) => (
          <FAQQuestion key={'faq' + idx} question={question} answer={answer} /> // eslint-disable-line
        ))}
      </CardWrapper>
    </Wrapper>
  );
};

export default FAQCards;
