import * as React from 'react';
import { inject } from 'mobx-react';

class Match extends React.Component<any> {
    componentDidMount() {
        if (typeof this.props.inProgressMatchStore === 'undefined' ||
            typeof this.props.inProgressMatchStore.match === 'undefined') {
            this.props.history.replace('/match/create');
            return;
        }

        if (typeof this.props.inProgressMatchStore.match.toss === 'undefined') {
            this.props.history.replace('/match/start');
            return;
        }

        if (!this.props.inProgressMatchStore.match.complete) {
            this.props.history.replace('/match/inprogress');
            return;
        }

        this.props.history.replace('/scorecard');
    }
    render() {
        return null;
    }
}

export default inject('inProgressMatchStore')(Match);
