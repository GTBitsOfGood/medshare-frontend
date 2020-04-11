import React, { memo } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { PageWrapper } from '../components/common';
import LoginForm from '../components/LoginForm';
import FileUpload from '../components/FileUpload/index';

const AdminPage = () => {
  const { authState } = useOktaAuth();

  return (
    <PageWrapper>
      <p style={{ color: '#706B6B', fontSize: '24px' }}>Admin Portal</p>
      {authState.isAuthenticated ? <FileUpload /> : <LoginForm />}
    </PageWrapper>
  );
};
export default memo(AdminPage);
