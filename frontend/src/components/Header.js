import React from 'react';
import styled from 'styled-components';
import Logo from '../resources/medshare-logo.png';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 1rem;
`;

const Header = () => {
  return (
    <Wrapper>
      <img src={Logo} alt="medshare-logo" width="75rem" height="75rem" margin-top="1.5rem" />
    </Wrapper>
  );
};

export default Header;
