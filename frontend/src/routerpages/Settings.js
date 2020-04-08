import React, { memo } from 'react';

import styled from 'styled-components';
import { InputGroup, Button } from '@blueprintjs/core';
import { PageWrapper } from '../components/common';

const InputWrapper = styled.div`
    input.bp3-input {
        padding: 0.35rem 1rem;
        box-sizing: border-box,
        box-shadow: 1rem;
        border: 1px solid #6396b3;
        border-radius: 10px;
        margin-bottom : 1.2rem;
    }
    input::placeholder {
       text-align: left;
       color: #9fc7de;
       font-size: 14px;
    }
`;

const Settings = () => {
  const onSubmit = () => {
    console.log('Submitted');
  };
  return (
    <PageWrapper>
      <p style={{ fontSize: '24px', marginBottom: '3rem' }}>Admin Portal</p>
      <InputWrapper>
        <InputGroup type="password" placeholder="old password" />
        <InputGroup type="password" placeholder="new password" />
        <InputGroup type="password" placeholder="confirm password" />
      </InputWrapper>
      <Button
        onClick={onSubmit}
        minimal
        style={{
          backgroundColor: '#6396B3',
          color: '#ffffff',
          borderRadius: '0.25rem'
        }}
      >
        RESET PASSWORD
      </Button>
    </PageWrapper>
  );
};
export default memo(Settings);
