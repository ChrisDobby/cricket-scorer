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

interface StartMatchProps {
    inProgressMatchStore: InProgressMatchStore;
    history: History;
    userProfile: Profile;
}

const StartMatch = (props: StartMatchProps) => {
    const { setOptions } = React.useContext(PageContext);
    React.useEffect(() => setOptions({ showMatchesLink: true }), []);

    return (
        <StartMatchComponent
            inProgress={props.inProgressMatchStore}
            storeMatch={storeMatch(props.inProgressMatchStore.setId)}
            {...props}
        />
    );
};

export default WithInProgressStore()(inject('inProgressMatchStore')(WithInProgressMatch(StartMatch)));
