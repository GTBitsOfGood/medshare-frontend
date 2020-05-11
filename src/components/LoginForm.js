import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { InputGroup, Button, Intent } from '@blueprintjs/core';
import { useOktaAuth } from '@okta/okta-react';
import OktaAuth from '@okta/okta-auth-js';

const FormWrapper = styled.form`
  margin-top: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Input = styled(InputGroup).attrs({ large: true })`
  margin-bottom: 1.5rem;
  width: 100%;
`;

const LoginForm = () => {
  const { authService } = useOktaAuth();
  const [sessionToken, setSessionToken] = useState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const oktaAuth = new OktaAuth({ issuer: process.env.REACT_APP_OKTA_ISSUER });
    oktaAuth
      .signIn({ username, password })
      .then(res => setSessionToken(res.sessionToken))
      .catch(err => console.log('Found an error', err));
  };

  const handleUsernameChange = e => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };

  if (sessionToken) {
    authService.redirect({ sessionToken });
    return null;
  }

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <Input type="text" placeholder="Username..." value={username} onChange={handleUsernameChange} />
      <Input type="password" placeholder="Password..." value={password} onChange={handlePasswordChange} />
      <Button type="submit" large text="Login" intent={Intent.PRIMARY} rightIcon="arrow-right" />
      <Link to="/reset-password" style={{ marginTop: '1rem' }}>
        Forgot Password?
      </Link>
    </FormWrapper>
  );
};

export default LoginForm;
