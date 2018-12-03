import * as React from 'react';
import matchApi from '../api/matchApi';
import liveUpdates, { UpdateType, EventType } from '../liveUpdates';
import { ONLINE } from '../context/networkStatus';

const WithInProgressMatches = (updates: any) => (Component: any) => class extends React.Component<any> {
    disconnect: (() => void) | undefined = undefined;
    retryTimer: any = undefined;

    state = {
        inProgressMatches: [],
        loadingMatches: false,
    };

    updateMatches = (updates: any) => this.setState({
        inProgressMatches: this.state.inProgressMatches.map((match: any) => {
            const updated = updates.find((update: any) => update.id === match.id);
            return typeof updated === 'undefined'
                ? match
                : {
                    ...match,
                    status: updated.status,
                    lastEvent: updated.lastEvent,
                };
        }),
    })

    addMatch = (match: any) => {
        const allMatches = [...this.state.inProgressMatches, match];
        this.setState({ inProgressMatches: allMatches });
    }

    subscribeToMatches = () => {
        this.disconnect = updates(
            () => this.state.inProgressMatches.map((match: any) => match.id),
            [
                { event: EventType.MatchUpdates, action: this.updateMatches },
                { event: EventType.NewMatch, action: this.addMatch, resubscribe: true },
            ]);
    }

    clearRetry = () => {
        if (typeof this.retryTimer !== 'undefined') {
            clearTimeout(this.retryTimer);
            this.retryTimer = undefined;
        }
    }

    setRetry = () => {
        if (typeof this.retryTimer === 'undefined') {
            this.retryTimer = setTimeout(this.getMatches, 60000);
        }
    }

    getMatches = async () => {
        try {
            this.clearRetry();
            this.setState({ loadingMatches: true });
            const inProgressMatches = await matchApi.getInProgressMatches();
            this.setState({ inProgressMatches, loadingMatches: false });
            this.subscribeToMatches();
        } catch (e) {
            this.setState({ inProgressMatches: [], loadingMatches: false });
            this.setRetry();
        }
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        if (prevProps.status === this.props.status) { return; }

        if (this.props.status === ONLINE) {
            this.getMatches();
        } else {
            this.setRetry();
        }
    }

    async componentDidMount() {
        this.getMatches();
    }

    componentWillUnmount() {
        if (typeof this.disconnect !== 'undefined') {
            this.disconnect();
        }
    }

    render() {
        return <Component {...this.props} {...this.state} />;
    }
};

export default WithInProgressMatches(liveUpdates(process.env.API_URL as string, UpdateType.AllUpdates));
