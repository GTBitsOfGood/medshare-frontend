import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Fallback from './components/Fallback';
import Home from './components/Home';

const theme = {
  fg: 'palevioletred',
  bg: 'white'
};
function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route component={Fallback} />
        </Switch>
      </ThemeProvider>
    </Router>
  );
}

export default App;
