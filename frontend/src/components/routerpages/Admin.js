import React from 'react';
import styled from 'styled-components';
import Header from '../Header';
import { deviceSize } from '../../theme';

const HeaderWrapper = styled.div`
  @media ${deviceSize.mobileL} {
    width: 100vw;
  }
  @media ${deviceSize.mobileS} {
    width: 100vw;
  }
`;

class Admin extends React.Component {
  render() {
    return (
      <>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <span>ADMIN PORTAL</span>
      </>
    );
  }
}
export default Admin;
