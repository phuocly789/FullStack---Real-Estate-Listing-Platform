import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import PropertyDetail from './pages/PropertyDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/property/:id" component={PropertyDetail} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin" component={AdminDashboard} />
    </Switch>
  </Router>,
  document.getElementById('root')
);