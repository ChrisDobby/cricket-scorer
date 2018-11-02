import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { InProgressMatchStore } from '../../stores/inProgressMatchStore';
import { default as WicketComponent } from '../../components/match/wicket/Wicket';
import storeMatch from '../../storeMatch';
import WithNavBar from '../../components/WithNavBar';
import WithInProgressStore from '../../components/WithInProgressStore';

interface WicketProps { inProgressMatchStore: InProgressMatchStore; }

const Wicket = observer(({ inProgressMatchStore }: WicketProps) => (
    <WicketComponent inProgress={inProgressMatchStore} storeMatch={storeMatch(inProgressMatchStore.setId)} />
));

export default WithInProgressStore()(inject('inProgressMatchStore')(WithNavBar({})(Wicket)));
