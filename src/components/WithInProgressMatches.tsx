import * as React from 'react';
import * as io from 'socket.io-client';
import matchApi from '../api/matchApi';

const updatesNamespace = '/matchupdates';
const matchIdsMsg = 'matchids';
const matchUpdatesMsg = 'matchupdates';
const newMatchMsg = 'newmatch';
const reconnectMsg = 'reconnect';

const WithInProgressMatches = (url: string) => (Component: any) => class extends React.Component<any> {
    socket: SocketIOClient.Socket | undefined = undefined;

    state = {
        inProgressMatches: [],
        loadingMatches: false,
    };

    sendSubscription = (matches: any[]) => (this.socket as SocketIOClient.Socket)
        .emit(matchIdsMsg, matches.map(match => match.id))

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
        this.sendSubscription(allMatches);
    }

    subscribeToMatches = (matches: any[]) => {
        if (matches.length === 0) { return; }
        this.socket = io(`${url}${updatesNamespace}`);

        this.socket.on(matchUpdatesMsg, this.updateMatches);
        this.socket.on(reconnectMsg, () => this.sendSubscription(matches));
        this.socket.on(newMatchMsg, this.addMatch);
        this.sendSubscription(matches);
    }

    async componentDidMount() {
        try {
            this.setState({ loadingMatches: true });
            const inProgressMatches = await matchApi.getInProgressMatches();
            this.subscribeToMatches(inProgressMatches);
            this.setState({ inProgressMatches, loadingMatches: false });
        } catch (e) {
            this.setState({ inProgressMatches: [], loadingMatches: false });
        }
    }

    componentWillUnmount() {
        if (typeof this.socket !== 'undefined') {
            this.socket.disconnect();
        }
    }

    render() {
        return <Component {...this.props} {...this.state} />;
    }
};

export default WithInProgressMatches(process.env.API_URL as string);
