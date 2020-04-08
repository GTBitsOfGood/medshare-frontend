import React, { memo, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { Button } from '@blueprintjs/core';
import { PageWrapper } from '../components/common';

const Successful = () => {
  const [back, setBack] = useState(false);

  if (back) {
    return <Redirect to="/settings" />;
  }

  return (
    <PageWrapper>
      <p style={{ color: '#706B6B', fontSize: '24px', marginBottom: '3rem' }}>Admin Portal</p>
      <p style={{ color: '#706B6B', fontSize: '20px', fontStyle: 'italic', marginBottom: '2rem' }}>
        Your password change is successful{' '}
      </p>
      <Button
        onClick={() => setBack(!back)}
        minimal
        style={{ backgroundColor: '#6396B3', color: '#ffffff', borderRadius: '0.25rem' }}
      >
        BACK
      </Button>
    </PageWrapper>
  );
};
export default memo(Successful);
