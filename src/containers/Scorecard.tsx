import * as React from 'react';
import Scorecard from '../components/scorecard/Scorecard';
import matchStorage from '../stores/matchStorage';
import WithNavBar from '../components/WithNavBar';
import WithMatchApi from '../components/WithMatchApi';
import Error from '../components/Error';
import Progress from '../components/Progress';
import liveUpdates, { UpdateType, EventType } from '../liveUpdates';

const updates = liveUpdates(process.env.API_URL as string, UpdateType.Scorecard);

export default WithNavBar({ stayWhenLoggingOut: true })(WithMatchApi(class extends React.Component<any> {
    disconnect: (() => void) | undefined = undefined;

    state = {
        match: undefined,
        lastEvent: undefined,
        loading: false,
        loadError: false,
    };

    updateScorecard = (match: any) => this.setState({ match });

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
            this.subscribeToUpdates(this.props.id);
            this.setState({ match: result.match, lastEvent: result.lastEvent, loading: false });
        } catch (e) {
            this.setState({ loading: false, loadError: true });
        }
    }

    componentDidMount() {
        if (typeof this.props.id !== 'undefined') {
            this.loadMatch();
        } else {
            const storedMatch = matchStorage(localStorage).getMatch();
            if (storedMatch) {
                this.setState({ match: storedMatch.match });
            }
        }
    }

    componentWillUnmount() {
        if (typeof this.disconnect !== 'undefined') {
            this.disconnect();
        }
    }

    loadErrorClosed = () => this.setState({ loadError: false });

    render() {
        if (typeof this.state.match !== 'undefined') {
            return <Scorecard cricketMatch={this.state.match} lastEvent={this.state.lastEvent} />;
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
}));
