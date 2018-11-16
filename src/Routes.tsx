import * as React from 'react';
import { Route } from 'react-router-dom';
import Scorecard from './containers/Scorecard';
import InProgress from './containers/match/InProgress';
import Wicket from './containers/match/Wicket';
import CreateMatch from './containers/match/CreateMatch';
import StartMatch from './containers/match/StartMatch';
import EditPlayers from './containers/match/EditPlayers';
import App from './App';
import Home from './containers/Home';
import Match from './containers/Match';
import MatchCentre from './containers/MatchCentre';
import auth0 from './components/auth0';

const Routes = () => (
    <div style={{ userSelect: 'none' }}>
        <Route path="/" component={App} />
        <Route exact path="/" component={auth0.WithAuth0(Home)} />
        <Route exact path="/auth" component={auth0.Auth} />
        <Route exact path="/match" component={Match} />
        <Route exact path="/match/create" component={auth0.AuthRequired(CreateMatch)}/>
        <Route exact path="/match/start" component={auth0.AuthRequired(StartMatch)}/>
        <Route exact path="/match/inprogress" component={auth0.AuthRequired(InProgress)}/>
        <Route exact path="/match/wicket" component={auth0.AuthRequired(Wicket)} />
        <Route exact path="/match/editplayers" component={auth0.AuthRequired(EditPlayers)} />
        <Route
            exact
            path="/scorecard/:id?"
            component={auth0.WithAuth0((props: any) => <Scorecard {...props} id={props.match.params.id} />)}
        />
        <Route exact path="/matchcentre" component={auth0.WithAuth0(MatchCentre)} />
    </div>
);

export default Routes;
