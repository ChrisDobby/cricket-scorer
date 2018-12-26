import * as React from 'react';
import { Route } from 'react-router-dom';
import App from './App';
import auth0 from './components/auth0';

const Home = React.lazy(() => import('./containers/Home'));
const Scorecard = React.lazy(() => import('./containers/Scorecard'));
const MatchCentre = React.lazy(() => import('./containers/MatchCentre'));
const Match = React.lazy(() => import('./containers/Match'));
const CreateMatch = React.lazy(() => import('./containers/match/CreateMatch'));
const StartMatch = React.lazy(() => import('./containers/match/StartMatch'));
const EditPlayers = React.lazy(() => import('./containers/match/EditPlayers'));
const EditEvents = React.lazy(() => import('./containers/match/EditEvents'));
const Wicket = React.lazy(() => import('./containers/match/Wicket'));
const InProgress = React.lazy(() => import('./containers/match/InProgress'));

const Routes = () => (
    <React.Suspense fallback={<div />}>
        <div style={{ userSelect: 'none' }}>
            <Route path="/" component={App} />
            <Route exact path="/" component={auth0.WithAuth0(Home)} />
            <Route exact path="/auth" component={auth0.Auth} />
            <Route exact path="/match" component={Match} />
            <Route exact path="/match/create" component={auth0.AuthRequired(CreateMatch)} />
            <Route exact path="/match/start" component={auth0.AuthRequired(StartMatch)} />
            <Route exact path="/match/inprogress" component={auth0.AuthRequired(InProgress)} />
            <Route exact path="/match/wicket" component={auth0.AuthRequired(Wicket)} />
            <Route exact path="/match/editplayers" component={auth0.AuthRequired(EditPlayers)} />
            <Route exact path="/match/editevents" component={auth0.AuthRequired(EditEvents)} />
            <Route
                exact
                path="/scorecard/:id?"
                component={auth0.WithAuth0((props: any) => <Scorecard {...props} id={props.match.params.id} />)}
            />
            <Route exact path="/matchcentre" component={auth0.WithAuth0(MatchCentre)} />
        </div>
    </React.Suspense>
);

export default Routes;
