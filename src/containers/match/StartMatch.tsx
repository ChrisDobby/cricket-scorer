import * as React from 'react';
import { inject } from 'mobx-react';
import { default as StartMatchComponent } from '../../components/match/start/StartMatch';
import storeMatch from '../../storeMatch';
import WithInProgressMatch from '../../components/WithInProgressMatch';
import WithInProgressStore from '../../components/WithInProgressStore';
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
                storeMatch={storeMatch(this.props.inProgressMatchStore.setId)}
                {...this.props}
            />);
    }
}

export default WithInProgressStore()(inject('inProgressMatchStore')(WithInProgressMatch(WithNavBar({})(StartMatch))));
