import React, { useState } from 'react';
import { Alignment, Button, Navbar, NavbarGroup, Drawer, Position } from '@blueprintjs/core';

import styled from 'styled-components';
import Logo from '../resources/medshare-logo.png';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
`;

const InsideDrawer = styled.div`
  margin: 1rem;
`;

const TextWrapper1 = styled.div`
  margin-left: 3rem;
  margin-bottom: 20rem;
`;

const TextWrapper2 = styled.div`
  display: flex;
  margin-top: 5rem;
  justify-content: center;
  border-top-style: solid;
`;

const NavBar = () => {
  const [drawer, handleDrawer] = useState(false);

  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <Button className="bp3-minimal" icon="menu" onClick={() => handleDrawer(true)} />
        <Drawer
          style={{ background: '#6396B3', color: '#FFFFFF' }}
          size="255px"
          isOpen={drawer}
          onClose={() => handleDrawer(false)}
          position={Position.LEFT}
        >
          <InsideDrawer>
            <Button classname="bp3-minimal" icon="menu" onClick={() => handleDrawer(false)} />
          </InsideDrawer>
          <TextWrapper1>
            <h1>SEARCH </h1>
            <h1>FAVORITES </h1>
            <h1>FAQ </h1>
          </TextWrapper1>
          <TextWrapper2>
            <h2 style={{ background: '#6396B3', color: '#FFFFFF' }}>ADMIN PORTAL</h2>
          </TextWrapper2>
        </Drawer>
      </NavbarGroup>
      <Wrapper>
        <img src={Logo} alt="medshare-logo" width="35rem" height="35rem" />
      </Wrapper>
    </Navbar>
  );
};
export default NavBar;
