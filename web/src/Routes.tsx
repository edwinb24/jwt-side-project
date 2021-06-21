import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

export const Routes: React.FC = () => {

  return <BrowserRouter>
    <Switch>
      <Route path="/" exact render={() => <div>Howdy friendo!</div>}/>
    </Switch>
  </BrowserRouter> ;
}

