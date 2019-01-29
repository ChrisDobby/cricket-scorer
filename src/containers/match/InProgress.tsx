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
    console.log(props.openDrawer);
    const { setOptions } = React.useContext(PageContext);
    React.useEffect(
        () =>
            setOptions({
                stayWhenLoggingOut: false,
                title: 'Cricket scores live',
                button: undefined,
                openDrawer: props.openDrawer,
            }),
        [],
    );
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
