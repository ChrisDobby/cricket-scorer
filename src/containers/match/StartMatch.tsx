import * as React from 'react';
import { inject } from 'mobx-react';
import { History } from 'history';
import { default as StartMatchComponent } from '../../components/match/start/StartMatch';
import storeMatch from '../../storeMatch';
import WithInProgressMatch from '../../components/WithInProgressMatch';
import WithInProgressStore from '../../components/WithInProgressStore';
import { InProgressMatchStore } from '../../stores/inProgressMatchStore';
import { Profile } from '../../domain';
import PageContext from '../../context/PageContext';
import WithLoggedOutWarning from '../../components/match/WithLoggedOutWarning';

interface StartMatchProps {
    inProgressMatchStore: InProgressMatchStore;
    history: History;
    userProfile: Profile;
    isAuthenticated: boolean;
}

const StartMatch = WithLoggedOutWarning((props: StartMatchProps) => {
    const { setOptions } = React.useContext(PageContext);
    React.useEffect(() => setOptions({ showMatchesLink: true }), []);

    return (
        <StartMatchComponent
            inProgress={props.inProgressMatchStore}
            storeMatch={storeMatch(props.isAuthenticated, props.inProgressMatchStore.setId)}
            {...props}
        />
    );
});

export default WithInProgressStore()(inject('inProgressMatchStore')(WithInProgressMatch(StartMatch)));
