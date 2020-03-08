import React from 'react';
import styled from 'styled-components';
import Logo from './medshare-logo.png';

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
      <img src={Logo} alt="medshare-logo" width="20%" height="20%" margin-top="1.5rem" />
    </Wrapper>
  );
};

export default Header;
