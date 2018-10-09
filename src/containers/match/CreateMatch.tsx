import * as React from 'react';
import { inject } from 'mobx-react';
import NewMatch from '../../components/match/create/NewMatch';
import matchStorage from '../../stores/matchStorage';

const CreateMatch = (props: any) => (
    <NewMatch inProgress={props.inProgressMatchStore} storage={matchStorage(localStorage)} {...props} />
);

export default inject('inProgressMatchStore')(CreateMatch);
