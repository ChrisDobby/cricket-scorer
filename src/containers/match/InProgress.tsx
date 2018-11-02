import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { default as InProgressComponent } from '../../components/match/inprogress/InProgress';
import storeMatch from '../../storeMatch';
import WithInProgressStore from '../../components/WithInProgressStore';
import WithInProgressMatch from '../../components/WithInProgressMatch';
import WithNavBar from '../../components/WithNavBar';
import WithMatchDrawer from '../../components/match/WithMatchDrawer';
import WithMatchActions from '../../components/match/WithMatchActions';

const InProgress = observer((props: any) => (
    <InProgressComponent
        {...props}
        inProgress={props.inProgressMatchStore}
        storeMatch={storeMatch(props.inProgressMatchStore.setId)}
    />
));

export default
    WithInProgressStore()(
        inject('inProgressMatchStore')(
            WithMatchActions(WithInProgressMatch(WithMatchDrawer(WithNavBar({})(InProgress)))),
        ));
