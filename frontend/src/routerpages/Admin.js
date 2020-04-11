import React, { memo } from 'react';
import { PageWrapper } from '../components/common';
import FileUpload from '../components/FileUpload/index';

const AdminPage = () => {
  return (
    <PageWrapper>
      <p style={{ color: '#706B6B', fontSize: '24px' }}>Admin Portal</p>
      <FileUpload />
    </PageWrapper>
  );
};
export default memo(AdminPage);
