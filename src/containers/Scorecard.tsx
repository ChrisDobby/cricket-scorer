import * as React from 'react';
import Scorecard from '../components/scorecard/Scorecard';
import matchStorage from '../stores/matchStorage';
import WithNavBar from '../components/WithNavBar';
import WithMatchApi from '../components/WithMatchApi';
import Error from '../components/Error';
import Progress from '../components/Progress';
import liveUpdates, { UpdateType, EventType } from '../liveUpdates';
import WithOutOfDateMatches from '../components/WithOutOfDateMatches';
import { Match } from '../domain';

const updates = liveUpdates(process.env.API_URL as string, UpdateType.Scorecard);
const matchUser = (match: any) => match.user;

export default WithOutOfDateMatches(
    WithNavBar({ stayWhenLoggingOut: true })(WithMatchApi(class extends React.Component<any> {
        disconnect: (() => void) | undefined = undefined;

        state = {
            match: undefined,
            lastEvent: undefined,
            loading: false,
            loadError: false,
            continueError: false,
            fetchingMatch: false,
        };

        updateScorecard = (item: any) => this.setState({ match: item.match, lastEvent: item.lastEvent });

        subscribeToUpdates = (id: string) =>
            this.disconnect = updates(
                () => id,
                [
                    { event: EventType.ScorecardUpdate, action: this.updateScorecard },
                ])

        loadMatch = async () => {
            this.setState({ loading: true, loadError: false });
            try {
                const result = await this.props.matchApi.getMatch(this.props.id);
                this.setState({ match: result.match, lastEvent: result.lastEvent, loading: false });
            } catch (e) {
                this.setState({ loading: false, loadError: true });
            }
        }

        async componentDidMount() {
            if (typeof this.props.id !== 'undefined') {
                await this.loadMatch();
            } else {
                const storedMatch = matchStorage(localStorage).getMatch();
                if (storedMatch) {
                    this.setState({ match: storedMatch.match });
                }
            }

            this.subscribeToUpdates(this.props.id);
        }

        componentWillUnmount() {
            if (typeof this.disconnect !== 'undefined') {
                this.disconnect();
            }
        }

        loadErrorClosed = () => this.setState({ loadError: false });
        continueErrorClosed = () => this.setState({ continueError: false });

        continueScoring = async () => {
            try {
                this.setState({ fetchingMatch: true, continueError: false });
                await this.props.fetchMatch(this.props.id);
                this.setState({ fetchingMatch: false });
                this.props.history.push('/match/inprogress');
            } catch (e) {
                this.setState({ fetchingMatch: false, continueError: true });
            }
        }

        get canContinue() {
            return this.props.isAuthenticated &&
                typeof this.state.match !== 'undefined' &&
                matchUser(this.state.match) === this.props.userProfile.id;
        }

        render() {
            if (typeof this.state.match !== 'undefined') {
                return (
                    <>
                        <Scorecard
                            cricketMatch={(this.state.match as any) as Match}
                            lastEvent={this.state.lastEvent}
                            canContinue={this.canContinue}
                            continue={this.continueScoring}
                        />
                        {this.state.continueError &&
                            <div>
                            <Error
                                message="Error continuing game.  Please try again"
                                onClose={this.continueErrorClosed}
                            />
                        </div>}
                    </>);
            }

            if (this.state.loading) {
                return <Progress />;
            }

            if (this.state.loadError) {
                return (
                    <div>
                        <Error message="Error loading match. Refresh to try again." onClose={this.loadErrorClosed} />
                    </div>);
            }

            return <div><Error message="No match found" onClose={() => { }} /></div>;
        }
    })));
