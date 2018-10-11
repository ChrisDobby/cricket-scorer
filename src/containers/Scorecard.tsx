import * as React from 'react';
import Scorecard from '../components/scorecard/Scorecard';
import matchStorage from '../stores/matchStorage';
import WithNavBar from '../components/WithNavBar';

export default WithNavBar(class extends React.Component {
    state = { match: undefined };

    componentDidMount() {
        const storedMatch = matchStorage(localStorage).getMatch();
        if (storedMatch) {
            this.setState({ match: storedMatch.match });
        }
    }

    render() {
        if (typeof this.state.match === 'undefined') {
            return <div />;
        }

        return <Scorecard cricketMatch={this.state.match} />;
    }
});
