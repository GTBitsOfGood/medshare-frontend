import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FormGroup, InputGroup, Button, Intent } from '@blueprintjs/core';

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

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState('');

  const handleChange = e => {
    setEmail(e.target.value);
    setErrMessage('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputWrapper
        label="Your login email"
        labelFor="reset-password-input"
        helperText={errMessage}
        intent={Intent.DANGER}
      >
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
