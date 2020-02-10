import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Fallback from './components/Fallback';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route component={Fallback} />
      </Switch>
    </Router>
  );
}

export default App;
