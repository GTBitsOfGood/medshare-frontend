import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useOktaAuth } from '@okta/okta-react';

import { Link } from 'react-router-dom';
import { Button, Drawer, Position } from '@blueprintjs/core';

const NavLink = styled(Link)`
  color: #ffffff;
  font-size: 24px;
  margin: 0.75rem 0.75rem;
`;

const MenuIconWrapper = styled.div`
  margin-left: 1.5rem;
  margin-top: 1.5rem;
`;

const LinkWrapper = styled.div`
  margin-left: 2rem;
  display: flex;
  flex-direction: column;
  padding-top: 0.5rem;
  padding-bottom: 10rem;
`;

const PortalTextWrapper = styled.div`
  display: flex;
  border-top-style: solid;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
`;

const DrawerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const HamburgerButton = styled(Button).attrs({
  icon: 'menu',
  className: 'bp3-minimal'
})`
  .bp3-icon {
    color: white;
  }
`;

const NavDrawer = ({ open, onClose }) => {
  const { authState, authService } = useOktaAuth();
  const handleLogoutClick = e => {
    e.preventDefault();
    authService.logout('/');
  };

  return (
    <Drawer
      style={{ background: '#6396B3', color: '#FFFFFF' }}
      size="255px"
      isOpen={open}
      onClose={onClose}
      position={Position.LEFT}
    >
      <DrawerWrapper>
        <MenuIconWrapper>
          <HamburgerButton onClick={onClose} />
        </MenuIconWrapper>
        <LinkWrapper>
          <NavLink to="/">Search</NavLink>
          <NavLink to="/saved">Saved Products</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          {authState.isAuthenticated && (
            <>
              <NavLink to="/admin">Upload</NavLink>
              <NavLink to="/settings">Settings</NavLink>
            </>
          )}
        </LinkWrapper>
        <PortalTextWrapper>
          {authState.isAuthenticated ? (
            <NavLink to="/" onClick={handleLogoutClick}>
              Log Out
            </NavLink>
          ) : (
            <NavLink to="/admin">Admin Portal</NavLink>
          )}
        </PortalTextWrapper>
      </DrawerWrapper>
    </Drawer>
  );
};
NavDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default NavDrawer;
