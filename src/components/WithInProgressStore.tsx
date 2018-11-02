import * as React from 'react';
import { Provider } from 'mobx-react';
import matchStorage from '../stores/matchStorage';
import inProgressMatchStore from '../stores/inProgressMatchStore';

export default () => (Component: any) => class extends React.Component {
    stores: any = { inProgressMatchStore };

    constructor(props: any) {
        super(props);
        const storedMatch = matchStorage(localStorage).getMatch();
        if (typeof storedMatch !== 'undefined' && storedMatch !== null) {
            inProgressMatchStore.setFromStoredMatch(storedMatch);
        }
    }

    render() {
        return (
            <Provider {...this.stores}>
                <Component {...this.props} />
            </Provider>);
    }
};
