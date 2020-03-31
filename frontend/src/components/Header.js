import React from 'react';
import styled from 'styled-components';

import NavBar from './NavBar';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 1rem;
`;

const Header = () => {
  return (
    <Wrapper>
      <NavBar />
    </Wrapper>
  );
};

export default Header;
