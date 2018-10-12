import * as React from 'react';
import { inject } from 'mobx-react';
import { default as StartMatchComponent } from '../../components/match/start/StartMatch';
import matchStorage from '../../stores/matchStorage';
import WithInProgressMatch from '../../components/WithInProgressMatch';
import WithNavBar from '../../components/WithNavBar';

class StartMatch extends React.Component<any> {
    componentDidMount() {
        if (typeof this.props.inProgressMatchStore.match === 'undefined') { return; }
        if (this.props.inProgressMatchStore.match.complete) {
            this.props.history.replace('/match/create');
        }
        if (this.props.inProgressMatchStore.match.innings.length > 0) {
            this.props.history.replace('/match/inprogress');
        }
    }

    render() {
        return (
            <StartMatchComponent
                inProgress={this.props.inProgressMatchStore}
                storage={matchStorage(localStorage)}
                {...this.props}
            />);
    }
}

export default inject('inProgressMatchStore')(WithInProgressMatch(WithNavBar(StartMatch)));
