import React, { useState, memo } from 'react';
import { ThemeProvider } from 'styled-components';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import { Route, Switch, useHistory, Redirect } from 'react-router-dom';

import Search from './routerpages/Search';
import FAQ from './routerpages/FAQ';
import Admin from './routerpages/Admin';
import Saved from './routerpages/Saved';
import Settings from './routerpages/Settings';
import NavBar from './components/NavBar';
import NavDrawer from './components/NavDrawer';
import { theme } from './theme';

function App() {
  const history = useHistory();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isAdmin] = useState(false);

  const onAuthRequired = () => {
    history.push('/');
  };

  const showDrawer = () => {
    setDrawerOpen(true);
  };
  const hideDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <Security
      pkce
      issuer={process.env.REACT_APP_OKTA_ISSUER}
      clientId={process.env.REACT_APP_OKTA_CLIENT_ID}
      redirectUri={window.location.origin + '/implicit/callback'}
      onAuthRequired={onAuthRequired}
    >
      <ThemeProvider theme={theme}>
        <NavBar onNavClick={showDrawer} />
        <NavDrawer open={isDrawerOpen} onClose={hideDrawer} isAdmin={isAdmin} />
        <Switch>
          <Route exact path="/">
            <Search />
          </Route>
          <Route exact path="/faq">
            <FAQ />
          </Route>
          <Route exact path="/admin">
            <Admin />
          </Route>
          <Route exact path="/saved">
            <Saved />
          </Route>
          <SecureRoute path="/settings" component={Settings} />
          <Route exact path="/">
            <Search />
          </Route>
          <Route exact path="/implicit/callback" component={LoginCallback} />
          <Redirect to="/" />
        </Switch>
      </ThemeProvider>
    </Security>
  );
}

export default memo(App);
