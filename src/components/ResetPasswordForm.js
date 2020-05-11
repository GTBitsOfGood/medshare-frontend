import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FormGroup, InputGroup, Button, Intent, Toaster, Position } from '@blueprintjs/core';
import OktaAuth from '@okta/okta-auth-js';

const Form = styled.form`
  width: 100%;
`;
const InputWrapper = styled(FormGroup)`
  width: 100%;
  margin-bottom: 1.5rem;
`;
const Input = styled(InputGroup)`
  width: 100%;
`;

export const messageToast = Toaster.create({
  position: Position.TOP
});

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setEmail(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const oktaAuth = new OktaAuth({ issuer: process.env.REACT_APP_OKTA_ISSUER });
      await oktaAuth.forgotPassword({
        username: email,
        factorType: 'EMAIL'
      });
      messageToast.show({
        icon: 'envelope',
        intent: Intent.SUCCESS,
        message: 'Password reset email has been sent!'
      });
      setEmail('');
    } catch (err) {
      console.log(err);
      messageToast.show({
        icon: 'error',
        intent: Intent.DANGER,
        message: 'Something went wrong, please try again'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputWrapper label="Your login email" labelFor="reset-password-input">
        <Input
          large
          id="reset-password-input"
          type="email"
          placeholder="Email..."
          onChange={handleChange}
          value={email}
        />
      </InputWrapper>
      <Button large disabled={email.length === 0 || loading} intent={Intent.PRIMARY} icon="envelope" type="submit">
        Email me password reset link
      </Button>
      <Link style={{ display: 'block', marginTop: '1rem' }} to="/admin">
        Back to Login
      </Link>
    </Form>
  );
};

export default ResetPasswordForm;
