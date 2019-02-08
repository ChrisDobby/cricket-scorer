import * as React from 'react';
import { inject } from 'mobx-react';
import storeMatch from '../../storeMatch';
import WithInProgressStore from '../../components/WithInProgressStore';
import Events from '../../components/match/edit/Events';
import PageContext from '../../context/PageContext';

const InProgress = (props: any) => {
    const { setOptions } = React.useContext(PageContext);
    React.useEffect(() => setOptions({ showMatchesLink: true }), []);

    return (
        <Events
            {...props}
            inProgress={props.inProgressMatchStore}
            storeMatch={storeMatch(props.isAuthenticated, props.inProgressMatchStore.setId)}
        />
    );
};

export default WithInProgressStore()(inject('inProgressMatchStore')(InProgress));
