import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Alignment, Button, Navbar, NavbarGroup } from '@blueprintjs/core';
import Logo from '../resources/medshare-logo.png';

const HamburgerButton = styled(Button)`
  position: absolute;
`;

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
  height: 100%;
`;

const NavBar = ({ onNavClick }) => {
  return (
    <Wrapper>
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
          <HamburgerButton className="bp3-minimal" icon="menu" onClick={onNavClick} />
        </NavbarGroup>
        <LogoWrapper>
          <img src={Logo} alt="medshare-logo" width="35rem" height="35rem" />
        </LogoWrapper>
      </Navbar>
    </Wrapper>
  );
};
NavBar.propTypes = {
  onNavClick: PropTypes.func.isRequired
};
export default NavBar;
