import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { InProgressMatchStore } from '../../stores/inProgressMatchStore';
import { default as InProgressComponent } from '../../components/match/inprogress/InProgress';
import storeMatch from '../../storeMatch';
import WithInProgressMatch from '../../components/WithInProgressMatch';
import WithNavBar from '../../components/WithNavBar';

interface InProgressProps { inProgressMatchStore: InProgressMatchStore; }

const InProgress = observer(({ inProgressMatchStore }: InProgressProps) => (
    <InProgressComponent
        inProgress={inProgressMatchStore}
        storeMatch={storeMatch(inProgressMatchStore.setId)}
    />
));

export default inject('inProgressMatchStore')(WithInProgressMatch(WithNavBar(InProgress)));
