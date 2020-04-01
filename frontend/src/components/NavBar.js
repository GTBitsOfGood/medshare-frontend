import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  display: flex;
  flex: column;
`;

const TextWrapper2 = styled.div`
  display: flex;
  margin-top: 10 rem;
  justify-content: center;
  border-top-style: solid;
  padding-top: 1rem;
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
            <span>
              <Link to="/" style={{ color: '#FFFFFF', size: '24px' }}>
                SEARCH
              </Link>{' '}
            </span>
            <span>
              <Link to="/saved" style={{ color: '#FFFFFF', size: '24px' }}>
                FAVORITES
              </Link>
            </span>
            <span>
              <Link to="/faq" style={{ color: '#FFFFFF', size: '24px' }}>
                FAQ
              </Link>
            </span>
          </TextWrapper1>
          <TextWrapper2>
            <div>
              <Link to="/admin" style={{ color: '#FFFFFF', size: '24px' }}>
                ADMIN PORTAL
              </Link>
            </div>
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
