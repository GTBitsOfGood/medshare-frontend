import React from 'react';
import { PageWrapper } from '../components/common';
import FAQCards from '../components/FAQCards';

const FAQPage = () => {
  return (
    <PageWrapper>
      <p style={{ color: '#706B6B', fontSize: '24px' }}>FAQ</p>
      <FAQCards />
    </PageWrapper>
  );
};
export default FAQPage;
