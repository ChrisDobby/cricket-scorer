import * as React from 'react';
import { Route } from 'react-router-dom';
import App from './App';
import WithAuth from './components/WithAuth';
import WithRequiredAuth from './components/WithRequiredAuth';
import AuthCallback from './components/AuthCallback';

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
        <div style={{ userSelect: 'none' }}>
            <Route path="/" component={App} />
            <Route exact path="/" component={WithAuth(Home)} />
            <Route exact path="/auth" component={AuthCallback} />
            <Route exact path="/match" render={(props: any) => <Match {...props}/>} />
            <Route exact path="/match/create" component={WithRequiredAuth(CreateMatch)} />
            <Route exact path="/match/start" component={WithRequiredAuth(StartMatch)} />
            <Route exact path="/match/inprogress" component={WithRequiredAuth(InProgress)} />
            <Route exact path="/match/wicket" component={WithRequiredAuth(Wicket)} />
            <Route exact path="/match/editplayers" component={WithRequiredAuth(EditPlayers)} />
            <Route exact path="/match/editevents" component={WithRequiredAuth(EditEvents)} />
            <Route
                exact
                path="/scorecard/:id?"
                component={WithAuth((props: any) => <Scorecard {...props} id={props.match.params.id} />)}
            />
            <Route exact path="/matchcentre" component={WithAuth(MatchCentre)} />
        </div>
);

export default Routes;
