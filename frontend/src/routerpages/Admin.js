import React, { memo } from 'react';
import { PageWrapper } from '../components/common';

const AdminPage = () => {
  return (
    <PageWrapper>
      <p style={{ color: '#706B6B', fontSize: '24px' }}>Admin Portal</p>
    </PageWrapper>
  );
};
export default memo(AdminPage);
