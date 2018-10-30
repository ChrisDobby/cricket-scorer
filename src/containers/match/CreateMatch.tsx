import * as React from 'react';
import { inject } from 'mobx-react';
import NewMatch from '../../components/match/create/NewMatch';
import WithNavBar from '../../components/WithNavBar';
import storeMatch from '../../storeMatch';
import MatchWithNetworkStatus from '../../components/match/MatchWithNetworkStatus';

const CreateMatch = (props: any) => (
    <NewMatch
        inProgress={props.inProgressMatchStore}
        storeMatch={storeMatch(props.inProgressMatchStore.setId)}
        {...props}
    />
);

export default inject('inProgressMatchStore')(MatchWithNetworkStatus(WithNavBar({})(CreateMatch)));
