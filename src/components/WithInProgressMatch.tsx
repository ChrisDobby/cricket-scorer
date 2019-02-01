import * as React from 'react';
import { History } from 'history';
import { InProgressMatch } from '../domain';
import matchRedirect from '../containers/match/matchRedirect';

interface WithInProgressMatchProps {
    inProgressMatchStore: InProgressMatch;
    history: History;
    location: Location;
}

export default (Component: any) => (props: WithInProgressMatchProps) => {
    React.useEffect(() => {
        matchRedirect(props.inProgressMatchStore, props.history, props.location);
    }, []);

    if (typeof props.inProgressMatchStore === 'undefined' || typeof props.inProgressMatchStore.match === 'undefined') {
        return null;
    }

    return <Component {...props} />;
};
