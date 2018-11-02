import * as React from 'react';
import Scorecard from '../components/scorecard/Scorecard';
import matchStorage from '../stores/matchStorage';
import WithNavBar from '../components/WithNavBar';
import WithMatchApi from '../components/WithMatchApi';
import Error from '../components/Error';
import Progress from '../components/Progress';

export default WithNavBar({ stayWhenLoggingOut: true })(WithMatchApi(class extends React.Component<any> {
    state = {
        match: undefined,
        loading: false,
        loadError: false,
    };

    loadMatch = async () => {
        this.setState({ loading: true, loadError: false });
        try {
            const result = await this.props.matchApi.getMatch(this.props.id);
            this.setState({ match: result.match, loading: false });
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

    loadErrorClosed = () => this.setState({ loadError: false });

    render() {
        if (typeof this.state.match !== 'undefined') {
            return <Scorecard cricketMatch={this.state.match} />;
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
