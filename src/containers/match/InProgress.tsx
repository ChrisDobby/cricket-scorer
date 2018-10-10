import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { InProgressMatchStore } from '../../stores/inProgressMatchStore';
import { default as InProgressComponent } from '../../components/match/inprogress/InProgress';
import matchStorage from '../../stores/matchStorage';
import WithInProgressMatch from '../../components/WithInProgressMatch';

interface InProgressProps { inProgressMatchStore: InProgressMatchStore; }

const InProgress = observer(({ inProgressMatchStore }: InProgressProps) => (
    <InProgressComponent inProgress={inProgressMatchStore} storage={matchStorage(localStorage)} />
));

export default inject('inProgressMatchStore')(WithInProgressMatch(InProgress));
