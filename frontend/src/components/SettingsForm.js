import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { InputGroup, Button, FormGroup, Intent } from '@blueprintjs/core';
import { useOktaAuth } from '@okta/okta-react';

const Form = styled.form`
  width: 100%;
`;

const InputWrapper = styled(FormGroup)`
  width: 100%;
  margin-bottom: 1.5rem;
`;
const Input = styled(InputGroup).attrs({
  large: true
})`
  width: 100%;
`;

const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*/g;
const validatePassword = password => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!passwordRegex.test(password)) {
    return 'Password must contain at least one lowercase letter, one uppercase letter, and one digit';
  }
  return null;
};

const SettingsForm = () => {
  const { authService } = useOktaAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [errMessage, setErrMessage] = useState(null);

  useEffect(() => {
    authService.getUser().then(user => {
      if (user) {
        setUsername(user.email);
      }
    });
  }, [authService]);

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };

  const handleConfirmedPasswordChange = e => {
    setConfirmedPassword(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const err = validatePassword(password);
    if (err) {
      setErrMessage(err);
    } else {
      setErrMessage(null);
    }
  };

  const passwordsMatch = useMemo(() => password === confirmedPassword, [password, confirmedPassword]);

  return (
    <Form onSubmit={handleSubmit}>
      <InputWrapper label="Username" labelFor="username-input">
        <Input disabled id="username-input" type="text" value={username} />
      </InputWrapper>
      <InputWrapper label="New Password" labelFor="password-input">
        <Input
          id="password-input"
          type="password"
          value={password}
          placeholder="New Password..."
          onChange={handlePasswordChange}
        />
      </InputWrapper>
      <InputWrapper
        label="Confirm Password"
        labelFor="confirmed-password-input"
        helperText={errMessage}
        intent={Intent.DANGER}
      >
        <Input
          id="confirmed-password-input"
          type="password"
          value={confirmedPassword}
          placeholder="Confirm Password..."
          onChange={handleConfirmedPasswordChange}
          intent={errMessage ? Intent.DANGER : Intent.NONE}
        />
      </InputWrapper>
      <Button large disabled={!passwordsMatch} type="submit" intent={Intent.PRIMARY}>
        Reset Password
      </Button>
    </Form>
  );
};
export default SettingsForm;
