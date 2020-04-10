import React, { memo } from 'react';
import { PageWrapper } from '../components/common';
import DropUpload from '../components/FileUpload';

const AdminPage = () => {
  return (
    <PageWrapper>
      <p style={{ color: '#706B6B', fontSize: '24px' }}>Admin Portal</p>
      <DropUpload />
    </PageWrapper>
  );
};
export default memo(AdminPage);
