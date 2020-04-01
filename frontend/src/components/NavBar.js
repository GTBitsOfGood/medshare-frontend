import React, { useState } from 'react';
import styled from 'styled-components';

import { Link } from 'react-router-dom';
import { Alignment, Button, Navbar, NavbarGroup, Drawer, Position } from '@blueprintjs/core';
import Logo from '../resources/medshare-logo.png';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 1rem;
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
`;

const MenuIconWrapper = styled.div`
  margin-left: 1.5rem;
  margin-top: 1.5rem;
`;

const TextWrapper1 = styled.div`
  margin-left: 2rem;
  display: flex;
  flex-direction: column;
  padding-top: 0.5rem;
  padding-bottom: 10rem;
`;

const TextWrapper2 = styled.div`
  display: flex;
  border-top-style: solid;
  align-items: center;
  justify-content: center;
  padding-bottom: 2.19rem;
  padding-top: 1.31rem;
`;

const DrawerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const NavBar = () => {
  const [drawer, handleDrawer] = useState(false);

  return (
    <Wrapper>
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
          <Button className="bp3-minimal" icon="menu" onClick={() => handleDrawer(true)} />
          <Drawer
            style={{ background: '#6396B3', color: '#FFF' }}
            size="255px"
            isOpen={drawer}
            onClose={() => handleDrawer(false)}
            position={Position.LEFT}
          >
            <DrawerWrapper>
              <MenuIconWrapper>
                <Button classname="bp3-minimal" icon="menu" onClick={() => handleDrawer(false)} />
              </MenuIconWrapper>
              <TextWrapper1>
                <Link to="/" style={{ color: '#FFF', fontSize: '24px', margin: '0.75rem 0.75rem' }}>
                  SEARCH
                </Link>
                <Link to="/saved" style={{ color: '#FFF', fontSize: '24px', margin: '0.75rem 0.75rem' }}>
                  FAVORITES
                </Link>
                <Link to="/faq" style={{ color: '#FFF', fontSize: '24px', margin: '0.75rem 0.75rem' }}>
                  FAQ
                </Link>
              </TextWrapper1>
              <TextWrapper2>
                <Link to="/admin" style={{ color: '#FFF', fontSize: '24px' }}>
                  ADMIN PORTAL
                </Link>
              </TextWrapper2>
            </DrawerWrapper>
          </Drawer>
        </NavbarGroup>
        <LogoWrapper>
          <img src={Logo} alt="medshare-logo" width="35rem" height="35rem" />
        </LogoWrapper>
      </Navbar>
    </Wrapper>
  );
};
export default NavBar;
