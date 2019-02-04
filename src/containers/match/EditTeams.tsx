import * as React from 'react';
import { inject } from 'mobx-react';
import storeMatch from '../../storeMatch';
import WithInProgressStore from '../../components/WithInProgressStore';
import Teams from '../../components/match/edit/Teams';
import PageContext from '../../context/PageContext';

const InProgress = (props: any) => {
    const { setOptions } = React.useContext(PageContext);
    React.useEffect(setOptions, []);

    return (
        <Teams
            {...props}
            inProgress={props.inProgressMatchStore}
            storeMatch={storeMatch(props.inProgressMatchStore.setId)}
        />
    );
};

export default WithInProgressStore()(inject('inProgressMatchStore')(InProgress));
