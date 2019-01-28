import * as React from 'react';
import { inject } from 'mobx-react';
import { default as InProgressComponent } from '../../components/match/inprogress/InProgress';
import storeMatch from '../../storeMatch';
import WithInProgressStore from '../../components/WithInProgressStore';
import WithInProgressMatch from '../../components/WithInProgressMatch';
import WithMatchDrawer from '../../components/match/WithMatchDrawer';
import WithMatchActions from '../../components/match/WithMatchActions';
import PageContext from '../../context/PageContext';

const InProgress = (props: any) => {
    const { setOptions } = React.useContext(PageContext);
    React.useEffect(setOptions, []);
    return (
        <InProgressComponent
            {...props}
            inProgress={props.inProgressMatchStore}
            storeMatch={storeMatch(props.inProgressMatchStore.setId)}
        />
    );
};

export default WithInProgressStore()(
    inject('inProgressMatchStore')(WithMatchActions(WithInProgressMatch(WithMatchDrawer(InProgress)))),
);
