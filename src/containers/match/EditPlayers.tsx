import * as React from 'react';
import { inject, observer } from 'mobx-react';
import storeMatch from '../../storeMatch';
import WithInProgressMatch from '../../components/WithInProgressMatch';
import WithInProgressStore from '../../components/WithInProgressStore';
import WithNavBar from '../../components/WithNavBar';
import Players from '../../components/match/edit/Players';

const InProgress = observer((props: any) => (
    <Players
        {...props}
        inProgress={props.inProgressMatchStore}
        storeMatch={storeMatch(props.inProgressMatchStore.setId)}
    />
));

export default WithInProgressStore()(
    inject('inProgressMatchStore')(
        WithInProgressMatch(WithNavBar({})(InProgress))));
