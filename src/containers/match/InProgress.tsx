import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { InProgressMatchStore } from '../../stores/inProgressMatchStore';
import { default as InProgressComponent } from '../../components/match/InProgress';

interface InProgressProps { inProgressMatchStore: InProgressMatchStore; }

const InProgress = observer(({ inProgressMatchStore }: InProgressProps) => (
    <InProgressComponent inProgress={inProgressMatchStore} />
));

export default inject('inProgressMatchStore')(InProgress);
