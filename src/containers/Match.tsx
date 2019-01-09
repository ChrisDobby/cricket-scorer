import * as React from 'react';
import { inject } from 'mobx-react';
import { History } from 'history';
import WithInProgressStore from '../components/WithInProgressStore';
import { InProgressMatch } from '../domain';

interface MatchProps {
    inProgressMatchStore: InProgressMatch;
    history: History;
}

const Match = (props: MatchProps) => {
    React.useEffect(() => {
        if (typeof props.inProgressMatchStore === 'undefined' ||
            typeof props.inProgressMatchStore.match === 'undefined') {
            props.history.replace('/match/create');
            return;
        }

        if (typeof props.inProgressMatchStore.match.toss === 'undefined') {
            props.history.replace('/match/start');
            return;
        }

        if (!props.inProgressMatchStore.match.complete) {
            props.history.replace('/match/inprogress');
            return;
        }

        props.history.replace('/scorecard');
    });

    return null;
};

export default WithInProgressStore()(inject('inProgressMatchStore')(Match));
