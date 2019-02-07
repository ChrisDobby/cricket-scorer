import * as React from 'react';
import { inject } from 'mobx-react';
import { History } from 'history';
import WithInProgressStore from '../components/WithInProgressStore';
import { InProgressMatch } from '../domain';
import matchRedirect from './match/matchRedirect';

interface MatchProps {
    inProgressMatchStore: InProgressMatch;
    history: History;
    location: Location;
}

const Match = (props: MatchProps) => {
    React.useEffect(() => {
        matchRedirect(props.inProgressMatchStore, props.history, props.location);
    });

    return null;
};

export default WithInProgressStore()(inject('inProgressMatchStore')(Match));
