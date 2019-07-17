import React from 'react';
import logo from './logo.svg';
import './App.css';
import Stops from './stops';
import Stop from './stop';
import Trip from './trip';
import Home from './home';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route exact path="/:region/stops" component={Stops} />
        <Route exact path="/:region/stop/:stopId" component={Stop} />
        <Route exact path="/:region/trip/:tripId" component={Trip} />
        {/* <Redirect to="/stops" /> */}
      </div>
    </Router>
  );
}

export default App;
