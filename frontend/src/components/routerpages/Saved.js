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

class Saved extends React.Component {
  render() {
    return (
      <>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <h1>Saved</h1>
      </>
    );
  }
}
export default Saved;
