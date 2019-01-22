import * as React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import CssBaseline from '@material-ui/core/CssBaseline';
import NavBar from './components/NavBar';
import WithAuth from './components/WithAuth';
import WithRequiredAuth from './components/WithRequiredAuth';
import AuthCallback from './components/AuthCallback';
import './routes.css';
import { History } from 'history';

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

const Routes = ({ location, history }: { location: any, history: History }) => (
    <div style={{ userSelect: 'none' }}>
        <CssBaseline />
        <NavBar location={location} history={history}>
            <TransitionGroup className="transition-group">
                <CSSTransition
                    key={location.key}
                    timeout={{ enter: 300, exit: 300 }}
                    classNames={'fade'}
                >
                    <section className="route-section">
                        <React.Suspense fallback={<div />}>
                            <Switch location={location}>
                                <Route exact path="/" component={WithAuth(Home)} />
                                <Route exact path="/auth" component={AuthCallback} />
                                <Route exact path="/match" render={(props: any) => <Match {...props} />} />
                                <Route exact path="/match/create" component={WithRequiredAuth(CreateMatch)} />
                                <Route exact path="/match/start" component={WithRequiredAuth(StartMatch)} />
                                <Route exact path="/match/inprogress" component={WithRequiredAuth(InProgress)} />
                                <Route exact path="/match/wicket" component={WithRequiredAuth(Wicket)} />
                                <Route exact path="/match/editplayers" component={WithRequiredAuth(EditPlayers)} />
                                <Route exact path="/match/editevents" component={WithRequiredAuth(EditEvents)} />
                                <Route
                                    exact
                                    path="/scorecard/:id?"
                                    component={WithAuth((props: any) =>
                                        <Scorecard {...props} id={props.match.params.id} />)}
                                />
                                <Route exact path="/matchcentre" component={WithAuth(MatchCentre)} />
                            </Switch>
                        </React.Suspense>
                    </section>
                </CSSTransition>
            </TransitionGroup>
        </NavBar>
    </div>
);

export default withRouter(Routes);
