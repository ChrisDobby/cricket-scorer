import * as React from 'react';
import { Route } from 'react-router-dom';
import WithNavBar from './components/WithNavBar';
import { Scorecard } from './components/scorecard/Scorecard';
import InProgress from './containers/match/InProgress';
import Wicket from './containers/match/Wicket';
import App from './App';
import { match } from './__tests__/testData/testMatch';

const CardWithNavBar = WithNavBar(Scorecard);

const Routes = () => (
    <div className="container-fluid" style={{ userSelect: 'none' }}>
        <Route path="/" component={App} />
        <Route exact path="/" render={() => <div id="home-route" />} />
        <Route exact path="/scorecard" render={props => <CardWithNavBar {...props} cricketMatch={match} />} />
        <Route exact path="/inprogress" component={InProgress} />
        <Route exact path="/inprogress/wicket" component={Wicket} />
    </div>
);

export default Routes;
