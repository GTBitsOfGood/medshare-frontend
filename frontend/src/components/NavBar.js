import React from 'react';
import { Alignment, Button, Navbar, NavbarGroup } from '@blueprintjs/core';

import styled from 'styled-components';
import Logo from '../resources/medshare-logo.png';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 3rem;
`;

const NavBar = () => {
    return (
        <Navbar>
            <NavbarGroup align={Alignment.LEFT}>
                <Button className="bp3-minimal" icon="menu"/>
            </NavbarGroup>
            <Wrapper>
                <img src={Logo} alt="medshare-logo" width="25rem" height="25rem" margin-top="1.5rem" />
            </Wrapper>
        </Navbar>
    )
}
export default NavBar;