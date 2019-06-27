import React from 'react';
import logo from './logo.svg';
import './App.css';
import Stops from './stops';
import Stop from './stop';
import Trip from './trip';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/stops" component={Stops} />
        <Route exact path="/stop/:stopId" component={Stop} />
        <Route exact path="/trip/:tripId" component={Trip} />
        {/* <Redirect to="/stops" /> */}
      </div>
    </Router>
  );
}

export default App;
