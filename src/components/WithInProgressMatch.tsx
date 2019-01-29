import * as React from 'react';
import { History } from 'history';
import { InProgressMatch } from '../domain';

interface WithInProgressMatchProps {
    inProgressMatchStore: InProgressMatch;
    history: History;
}

export default (Component: any) => (props: WithInProgressMatchProps) => {
    React.useEffect(() => {
        if (
            typeof props.inProgressMatchStore === 'undefined' ||
            typeof props.inProgressMatchStore.match === 'undefined'
        ) {
            props.history.replace('/match/create');
        }
    }, []);

    if (typeof props.inProgressMatchStore === 'undefined' || typeof props.inProgressMatchStore.match === 'undefined') {
        return null;
    }

    return <Component {...props} />;
};
