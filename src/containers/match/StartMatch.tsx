import * as React from 'react';
import { inject } from 'mobx-react';
import { default as StartMatchComponent } from '../../components/match/start/StartMatch';
import matchStorage from '../../stores/matchStorage';
import WithInProgressMatch from '../../components/WithInProgressMatch';
import WithNavBar from '../../components/WithNavBar';

const StartMatch = (props: any) => (
    <StartMatchComponent inProgress={props.inProgressMatchStore} storage={matchStorage(localStorage)} {...props} />
);

export default inject('inProgressMatchStore')(WithInProgressMatch(WithNavBar(StartMatch)));
