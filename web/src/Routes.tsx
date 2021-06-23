import React from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { Bye } from './pages/Bye';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export const Routes: React.FC = () => (
  <BrowserRouter>
    <div>
      <header>
        <div>
          <Link to="/">home</Link>
        </div>
        <div>
          <Link to="/register">Register</Link>
        </div>
        <div>
          <Link to="/login">Login</Link>
        </div>
        <div>
          <Link to="/bye">Bye</Link>
        </div>
      </header>
    </div>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
      <Route path="/bye" exact component={Bye} />
    </Switch>
  </BrowserRouter>
);
