import * as React from 'react';
import { Provider } from 'mobx-react';
import matchStorage from '../stores/matchStorage';
import inProgressMatchStore from '../stores/inProgressMatchStore';

export default () => (Component: any) => (props: any) => {
    const stores = { inProgressMatchStore };
    const storedMatch = matchStorage(localStorage).getMatch();

    if (typeof storedMatch !== 'undefined' && storedMatch !== null) {
        inProgressMatchStore.setFromStoredMatch(storedMatch);
    }

    return (
        <Provider {...stores}>
            <Component {...props} />
        </Provider>);
};
