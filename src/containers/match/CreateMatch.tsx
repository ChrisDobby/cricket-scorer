import * as React from 'react';
import { inject } from 'mobx-react';
import NewMatch from '../../components/match/create/NewMatch';
import matchStorage from '../../stores/matchStorage';
import { InProgressMatchStore } from '../../stores/inProgressMatchStore';

const CreateMatch = (props: any, inProgressMatchStore: InProgressMatchStore) => (
    <NewMatch inProgress={inProgressMatchStore} storage={matchStorage(localStorage)} {...props} />
);

export default inject('inProgressMatchStore')(CreateMatch);
