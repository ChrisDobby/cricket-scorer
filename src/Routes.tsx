import * as React from 'react';
import { Route } from 'react-router-dom';
import WithNavBar from './components/WithNavBar';
import { Scorecard } from './components/match/Scorecard';
import { match } from './__tests__/testData/testMatch';

const CardWithNavBar = WithNavBar(Scorecard);

const Routes = () => (
    <div className="container-fluid">
        <Route exact path="/" render={() => <div id="home-route" />} />
        <Route exact path="/scorecard" render={props => <CardWithNavBar {...props} cricketMatch={match} />} />
    </div>
);

export default Routes;
