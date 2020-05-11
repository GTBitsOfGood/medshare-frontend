import React, { memo } from 'react';

import { PageWrapper } from '../components/common';
import SettingsForm from '../components/SettingsForm';

const Settings = () => {
  return (
    <PageWrapper>
      <p style={{ fontSize: '24px', marginBottom: '3rem' }}>Admin Portal</p>
      <SettingsForm />
    </PageWrapper>
  );
};
export default memo(Settings);
