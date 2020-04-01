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
const WidthMax = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;
  @media ${deviceSize.laptop} {
    max-width: 500px;
  }
  @media ${deviceSize.mobileL} {
    max-width: 350px;
  }
  @media ${deviceSize.mobileS} {
    max-width: 300px;
  }
`;

class Admin extends React.Component {
  render() {
    return (
      <>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <WidthMax>
          <p style={{ color: '#706B6B', fontSize: '24px' }}>Admin Portal</p>
        </WidthMax>
      </>
    );
  }
}
export default Admin;
