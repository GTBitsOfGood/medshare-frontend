import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Fallback from './components/Fallback';
import SearchPage from './components/SearchPage';
import { theme } from './theme';

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/">
            <SearchPage />
          </Route>
          <Route component={Fallback} />
        </Switch>
      </ThemeProvider>
    </Router>
  );
}

export default App;
