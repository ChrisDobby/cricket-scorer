import * as React from 'react';
import OutOfDateDialog from './OutOfDateDialog';
import matchStorage from '../stores/matchStorage';
import fetchMatch from '../match/fetchMatch';
import WithMatchApi from './WithMatchApi';
import { Profile, StoredMatch, PersistedMatch } from '../domain';
export interface OutOfDateMatch extends PersistedMatch {
    removed: boolean;
    removeError: boolean;
    continueError: boolean;
}

interface MatchApi {
    getMatch: (id: string) => Promise<any>;
    sendMatch: (match: StoredMatch) => Promise<any>;
    removeMatch: (id: string) => Promise<void>;
    getOutOfDateMatches: (id: string) => Promise<PersistedMatch>;
}

interface WithOutOfDateMatchesProps {
    isAuthenticated: boolean;
    userProfile: Profile;
    matchApi: MatchApi;
    history: any;
}

export default (Component: any) => WithMatchApi(class extends React.PureComponent<WithOutOfDateMatchesProps> {
    state = {
        outOfDateMatches: [],
        showingDialog: false,
        waiting: false,
    };

    getMatch = fetchMatch(this.props.matchApi, matchStorage(localStorage));

    udpateMatches = async () => {
        if (this.props.isAuthenticated) {
            const matches = await this.props.matchApi.getOutOfDateMatches(this.props.userProfile.id);
            this.setState({ outOfDateMatches: matches });
        } else {
            this.setState({ outOfDateMatches: [] });
        }
    }

    async componentDidMount() {
        this.udpateMatches();
    }

    componentDidUpdate(prevProps: WithOutOfDateMatchesProps) {
        if (prevProps.isAuthenticated === this.props.isAuthenticated) {
            return;
        }
    }

    showDialog = () => this.setState({ showingDialog: true });
    hideDialog = () => {
        this.setState({
            showingDialog: false,
            outOfDateMatches: [...this.state.outOfDateMatches.filter((m: OutOfDateMatch) => !m.removed)],
        });
    }

    removeMatch = async (id: string) => {
        this.setState({ waiting: true });
        try {
            await this.props.matchApi.removeMatch(id);
            this.setState({
                outOfDateMatches: [
                    ...this.state.outOfDateMatches.map((m: OutOfDateMatch) => m.id !== id
                        ? m
                        : { ...m, removed: true, removeError: false }),
                ],
                waiting: false,
            });
        } catch (e) {
            this.setState({
                outOfDateMatches: [
                    ...this.state.outOfDateMatches.map((m: OutOfDateMatch) => m.id !== id
                        ? m
                        : { ...m, removeError: true }),
                ],
                waiting: false,
            });
        }
    }

    continueMatch = async (id: string) => {
        try {
            this.setState({ waiting: true });
            await this.getMatch(id);
            this.props.history.push('/match/inprogress');
        } catch (e) {
            this.setState({
                outOfDateMatches: [
                    ...this.state.outOfDateMatches.map((m: OutOfDateMatch) => m.id !== id
                        ? m
                        : { ...m, fetchError: true }),
                ],
                waiting: false,
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <Component
                    {...this.props}
                    outOfDateMatches={this.state.outOfDateMatches}
                    outOfDateSelected={this.showDialog}
                />
                {this.state.showingDialog &&
                    <OutOfDateDialog
                        matches={this.state.outOfDateMatches}
                        close={this.hideDialog}
                        remove={this.removeMatch}
                        continue={this.continueMatch}
                        disabled={this.state.waiting}
                    />}
            </React.Fragment>);
    }
});
