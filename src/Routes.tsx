import * as React from 'react';
import { Route } from 'react-router-dom';
import WithNavBar from './components/WithNavBar';
import { Scorecard } from './components/scorecard/Scorecard';
import InProgress from './containers/match/InProgress';
import Wicket from './containers/match/Wicket';
import CreateMatch from './containers/match/CreateMatch';
import StartMatch from './containers/match/StartMatch';
import App from './App';
import Home from './components/Home';
import auth0 from './components/auth0';
import { match } from './__tests__/testData/testMatch';

const CardWithNavBar = WithNavBar(Scorecard);

const Routes = () => (
    <div className="container-fluid" style={{ userSelect: 'none' }}>
        <Route path="/" component={App} />
        <Route exact path="/" component={auth0.WithAuth0(Home)} />
        <Route exact path="/auth" component={auth0.Auth} />
        <Route exact path="/match/create" component={auth0.AuthRequired(CreateMatch)}/>
        <Route exact path="/match/start" component={auth0.AuthRequired(StartMatch)}/>
        <Route exact path="/scorecard" render={props => <CardWithNavBar {...props} cricketMatch={match} />} />
        <Route exact path="/inprogress" component={InProgress} />
        <Route exact path="/inprogress/wicket" component={Wicket} />
    </div>
);

export default Routes;
