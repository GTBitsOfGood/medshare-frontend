import React from 'react';
import { Alignment, Button, Navbar, NavbarGroup } from '@blueprintjs/core';

import styled from 'styled-components';
import Logo from '../resources/medshare-logo.png';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
`;

const NavBar = () => {
  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <Button className="bp3-minimal" icon="menu" />
      </NavbarGroup>
      <Wrapper>
        <img src={Logo} alt="medshare-logo" width="35rem" height="35rem" />
      </Wrapper>
    </Navbar>
  );
};
export default NavBar;
