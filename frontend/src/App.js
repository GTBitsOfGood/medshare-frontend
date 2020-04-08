import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Fallback from './routerpages/Fallback';
import Search from './routerpages/Search';
import FAQ from './routerpages/FAQ';
import Admin from './routerpages/Admin';
import Saved from './routerpages/Saved';
import Settings from './routerpages/Settings';
import NavBar from './components/NavBar';
import NavDrawer from './components/NavDrawer';
import { theme } from './theme';

function App() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isAdmin] = useState(false);

  const showDrawer = () => {
    setDrawerOpen(true);
  };
  const hideDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <Router>
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
          <Route exact path="/settings">
            <Settings />
          </Route>
          <Route exact path="/">
            <Search />
          </Route>
          <Route component={Fallback} />
        </Switch>
      </ThemeProvider>
    </Router>
  );
}

export default App;
