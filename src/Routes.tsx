import * as React from 'react';
import { Route } from 'react-router-dom';

const Routes = () => (
    <div>
        <Route exact path="/" render={() => <div id="home-route" />} />
    </div>
);

export default Routes;
