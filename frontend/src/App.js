import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Fallback from './components/routerpages/Fallback';
import Search from './components/routerpages/Search';
import FAQ from './components/routerpages/FAQ';
import Admin from './components/routerpages/Admin';
import Saved from './components/routerpages/Saved';
import { theme } from './theme';

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
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
