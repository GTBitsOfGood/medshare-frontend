import React from 'react';
import styled from 'styled-components';
import NavBar from '../components/NavBar';
import { deviceSize } from '../theme';

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

class Saved extends React.Component {
  render() {
    return (
      <>
        <NavBar />
        <WidthMax>
          <p style={{ color: '#706B6B', fontSize: '24px' }}>Favorites</p>
        </WidthMax>{' '}
      </>
    );
  }
}
export default Saved;
