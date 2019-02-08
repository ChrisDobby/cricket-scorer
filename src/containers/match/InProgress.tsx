import * as React from 'react';
import { inject } from 'mobx-react';
import { default as InProgressComponent } from '../../components/match/inprogress/InProgress';
import storeMatch from '../../storeMatch';
import WithInProgressStore from '../../components/WithInProgressStore';
import WithInProgressMatch from '../../components/WithInProgressMatch';
import WithMatchDrawer from '../../components/match/WithMatchDrawer';
import WithMatchActions from '../../components/match/WithMatchActions';
import PageContext from '../../context/PageContext';
import WithLoggedOutWarning from '../../components/match/WithLoggedOutWarning';

const InProgress = WithLoggedOutWarning((props: any) => {
    const { setOptions } = React.useContext(PageContext);
    React.useEffect(
        () =>
            setOptions({
                openDrawer: props.openDrawer,
            }),
        [],
    );
    return (
        <InProgressComponent
            {...props}
            inProgress={props.inProgressMatchStore}
            storeMatch={storeMatch(props.isAuthenticated, props.inProgressMatchStore.setId)}
        />
    );
});

export default WithInProgressStore()(
    inject('inProgressMatchStore')(WithMatchActions(WithInProgressMatch(WithMatchDrawer(InProgress)))),
);
