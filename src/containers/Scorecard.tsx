import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Scorecard from '../components/scorecard/Scorecard';
import matchStorage from '../stores/matchStorage';
import WithNavBar from '../components/WithNavBar';
import WithMatchApi from '../components/WithMatchApi';
import Error from '../components/Error';

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

    render() {
        if (typeof this.state.match !== 'undefined') {
            return <Scorecard cricketMatch={this.state.match} />;
        }

        if (this.state.loading) {
            return <CircularProgress size={50}/>;
        }

        if (this.state.loadError) {
            return <div><Error message="Error loading match. Refresh to try again." /></div>;
        }

        return <div><Error message="No match found" /></div>;
    }
}));
