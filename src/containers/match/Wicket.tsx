import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { InProgressMatchStore } from '../../stores/inProgressMatchStore';
import { default as WicketComponent } from '../../components/match/wicket/Wicket';
import matchStorage from '../../stores/matchStorage';
import WithNavBar from '../../components/WithNavBar';

interface WicketProps { inProgressMatchStore: InProgressMatchStore; }

const Wicket = observer(({ inProgressMatchStore }: WicketProps) => (
    <WicketComponent inProgress={inProgressMatchStore} storage={matchStorage(localStorage)} />
));

export default inject('inProgressMatchStore')(WithNavBar(Wicket));
