import React from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export const Routes: React.FC = () => (
  <BrowserRouter>
    <div>
      <header>
        <div>
          <Link to="/home">home</Link>
        </div>
        <div>
          <Link to="/register">Register</Link>
        </div>
        <div>
          <Link to="/login">Login</Link>
        </div>
      </header>
    </div>
    <Switch>
      <Route path="/home" exact component={Home} />
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
    </Switch>
  </BrowserRouter>
);
