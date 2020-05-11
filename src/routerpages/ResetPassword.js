import React, { memo } from 'react';

import { PageWrapper } from '../components/common';
import ResetPasswordForm from '../components/ResetPasswordForm';

const Settings = () => {
  return (
    <PageWrapper>
      <p style={{ fontSize: '24px', marginBottom: '3rem' }}>Reset Password</p>
      <ResetPasswordForm />
    </PageWrapper>
  );
};
export default memo(Settings);
