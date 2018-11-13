import * as React from 'react';
import matchApi from '../api/matchApi';
import OutOfDateDialog from './OutOfDateDialog';
import matchStorage from '../stores/matchStorage';
import fetchMatch from '../match/fetchMatch';

const FetchMatch = fetchMatch(matchApi, matchStorage(localStorage));

export default (Component: any) => class extends React.PureComponent<any> {
    state = {
        outOfDateMatches: [],
        showingDialog: false,
        waiting: false,
    };

    udpateMatches = async () => {
        if (this.props.isAuthenticated) {
            const matches = await matchApi.getOutOfDateMatches(this.props.userProfile.id);
            this.setState({ outOfDateMatches: matches });
        } else {
            this.setState({ outOfDateMatches: [] });
        }
    }

    async componentDidMount() {
        this.udpateMatches();
    }

    componentDidUpdate(prevProps: any) {
        if (prevProps.isAuthenticated === this.props.isAuthenticated) {
            return;
        }
    }

    showDialog = () => this.setState({ showingDialog: true });
    hideDialog = () => {
        this.setState({
            showingDialog: false,
            outOfDateMatches: [...this.state.outOfDateMatches.filter((m: any) => !m.removed)],
        });
    }

    removeMatch = async (id: string) => {
        this.setState({ waiting: true });
        try {
            await matchApi.removeMatch(id);
            this.setState({
                outOfDateMatches: [
                    ...this.state.outOfDateMatches.map((m: any) => m.id !== id
                        ? m
                        : { ...m, removed: true, removeError: false }),
                ],
                waiting: false,
            });
        } catch (e) {
            this.setState({
                outOfDateMatches: [
                    ...this.state.outOfDateMatches.map((m: any) => m.id !== id
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
            await FetchMatch(id);
            this.props.history.push('/match/inprogress');
        } catch (e) {
            this.setState({
                outOfDateMatches: [
                    ...this.state.outOfDateMatches.map((m: any) => m.id !== id
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
};
