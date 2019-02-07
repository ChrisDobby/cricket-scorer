import * as React from 'react';
import { inject } from 'mobx-react';
import NewMatch from '../../components/match/create/NewMatch';
import storeMatch from '../../storeMatch';
import matchStorage from '../../stores/matchStorage';
import MatchWithNetworkStatus from '../../components/match/MatchWithNetworkStatus';
import WithInProgressStore from '../../components/WithInProgressStore';
import PageContext from '../../context/PageContext';

const CreateMatch = (props: any) => {
    const { setOptions } = React.useContext(PageContext);
    React.useEffect(() => setOptions({ showMatchesLink: true }), []);

    return (
        <NewMatch
            inProgress={props.inProgressMatchStore}
            storeMatch={storeMatch(props.inProgressMatchStore.setId)}
            storedMatch={matchStorage(localStorage).getMatch()}
            {...props}
        />
    );
};

export default WithInProgressStore()(inject('inProgressMatchStore')(MatchWithNetworkStatus(CreateMatch)));
