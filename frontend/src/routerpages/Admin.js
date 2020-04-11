import React, { memo } from 'react';
import { PageWrapper } from '../components/common';
import LoginForm from '../components/LoginForm';
import FileUpload from '../components/FileUpload/index';

const AdminPage = () => {
  return (
    <PageWrapper>
      <p style={{ color: '#706B6B', fontSize: '24px' }}>Admin Portal</p>
      <LoginForm />
      <FileUpload />
    </PageWrapper>
  );
};
export default memo(AdminPage);
