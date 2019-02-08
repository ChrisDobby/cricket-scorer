import * as React from 'react';
import { inject } from 'mobx-react';
import { InProgressMatchStore } from '../../stores/inProgressMatchStore';
import { default as WicketComponent } from '../../components/match/wicket/Wicket';
import storeMatch from '../../storeMatch';
import WithInProgressStore from '../../components/WithInProgressStore';
import { Profile } from '../../domain';
import PageContext from '../../context/PageContext';
import WithLoggedOutWarning from '../../components/match/WithLoggedOutWarning';

interface WicketProps {
    inProgressMatchStore: InProgressMatchStore;
    userProfile: Profile;
    isAuthenticated: boolean;
}

const Wicket = WithLoggedOutWarning(({ inProgressMatchStore, userProfile, isAuthenticated }: WicketProps) => {
    const { setOptions } = React.useContext(PageContext);
    React.useEffect(() => setOptions({ showMatchesLink: true }), []);

    return (
        <WicketComponent
            inProgress={inProgressMatchStore}
            storeMatch={storeMatch(isAuthenticated, inProgressMatchStore.setId)}
            userProfile={userProfile}
        />
    );
});

export default WithInProgressStore()(inject('inProgressMatchStore')(Wicket));
