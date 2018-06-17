import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { InProgressMatchStore } from '../../stores/inProgressMatchStore';
import { default as InProgressComponent } from '../../components/match/InProgress';
import matchStorage from '../../stores/matchStorage';

interface InProgressProps { inProgressMatchStore: InProgressMatchStore; }

const InProgress = observer(({ inProgressMatchStore }: InProgressProps) => (
    <InProgressComponent inProgress={inProgressMatchStore} storage={matchStorage(localStorage)} />
));

export default inject('inProgressMatchStore')(InProgress);
