import * as React from 'react';
import { inject } from 'mobx-react';
import NewMatch from '../../components/match/create/NewMatch';
import storeMatch from '../../storeMatch';
import matchStorage from '../../stores/matchStorage';
import MatchWithNetworkStatus from '../../components/match/MatchWithNetworkStatus';
import WithInProgressStore from '../../components/WithInProgressStore';
import PageContext from '../../context/PageContext';

const CreateMatch = (props: any) => (
    <PageContext.Consumer>{({ setOptions }) =>
        <NewMatch
            inProgress={props.inProgressMatchStore}
            storeMatch={storeMatch(props.inProgressMatchStore.setId)}
            storedMatch={matchStorage(localStorage).getMatch()}
            setPageOptions={setOptions}
            {...props}
        />}
    </PageContext.Consumer>);

export default
    WithInProgressStore()(inject('inProgressMatchStore')(MatchWithNetworkStatus(CreateMatch)));
