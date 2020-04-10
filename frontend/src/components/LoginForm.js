import React from 'react';
import styled from 'styled-components';
import { InputGroup, Button, Intent } from '@blueprintjs/core';

const FormWrapper = styled.form`
  margin-top: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled(InputGroup).attrs({ large: true })`
  margin-bottom: 1.5rem;
  width: 100%;
`;

const LoginForm = () => {
  const handleSubmit = e => {
    e.preventDefault();
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <Input type="text" placeholder="Username..." />
      <Input type="password" placeholder="Password..." />
      <Button type="submit" large text="Login" intent={Intent.PRIMARY} rightIcon="arrow-right" />
    </FormWrapper>
  );
};

export default LoginForm;
