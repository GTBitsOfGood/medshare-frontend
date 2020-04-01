import React from 'react';
import styled from 'styled-components';
import { deviceSize } from '../theme';

import NavBar from '../components/NavBar';
import FAQCards from '../components/FAQCards';

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

class FAQ extends React.Component {
  render() {
    return (
      <>
        <NavBar />
        <WidthMax>
          <p style={{ color: '#706B6B', fontSize: '24px' }}>FAQ</p>
          <FAQCards />
        </WidthMax>
      </>
    );
  }
}
export default FAQ;
