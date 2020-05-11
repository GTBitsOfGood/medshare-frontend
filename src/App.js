import React, { useState, memo } from 'react';
import { ThemeProvider } from 'styled-components';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';
import { Route, Switch, useHistory, Redirect } from 'react-router-dom';

import Search from './routerpages/Search';
import FAQ from './routerpages/FAQ';
import Admin from './routerpages/Admin';
import Settings from './routerpages/Settings';
import Saved from './routerpages/Saved';
import ResetPassword from './routerpages/ResetPassword';
import NavBar from './components/NavBar';
import NavDrawer from './components/NavDrawer';
import SavedProductsContainer from './containers/savedProductsContainer';
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
        <SavedProductsContainer.Provider>
          <Switch>
            <Route exact path="/faq">
              <FAQ />
            </Route>
            <Route exact path="/">
              <Search />
            </Route>
            <Route exact path="/saved">
              <Saved />
            </Route>
            <Route exact path="/admin">
              <Admin />
            </Route>
            <Route exact path="/reset-password">
              <ResetPassword />
            </Route>
            <SecureRoute path="/settings" component={Settings} />
            <Route exact path="/implicit/callback" component={LoginCallback} />
            <Redirect to="/" />
          </Switch>
        </SavedProductsContainer.Provider>
      </ThemeProvider>
    </Security>
  );
}

export default memo(App);
