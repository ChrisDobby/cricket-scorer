import * as React from 'react';
import { inject, observer } from 'mobx-react';
// import { InProgressMatchStore } from '../../stores/inProgressMatchStore';
import { default as InProgressComponent } from '../../components/match/inprogress/InProgress';
import storeMatch from '../../storeMatch';
import WithInProgressMatch from '../../components/WithInProgressMatch';
import WithNavBar from '../../components/WithNavBar';
import WithMatchDrawer from '../../components/match/WithMatchDrawer';
import WithMatchActions from '../../components/match/WithMatchActions';

// interface InProgressProps { inProgressMatchStore: InProgressMatchStore; }

const InProgress = observer((props: any) => (
    <InProgressComponent
        {...props}
        inProgress={props.inProgressMatchStore}
        storeMatch={storeMatch(props.inProgressMatchStore.setId)}
    />
));

export default
    inject('inProgressMatchStore')(WithMatchActions(WithInProgressMatch(WithMatchDrawer(WithNavBar(InProgress)))));
