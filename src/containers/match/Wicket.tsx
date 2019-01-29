import * as React from 'react';
import { inject } from 'mobx-react';
import { InProgressMatchStore } from '../../stores/inProgressMatchStore';
import { default as WicketComponent } from '../../components/match/wicket/Wicket';
import storeMatch from '../../storeMatch';
import WithInProgressStore from '../../components/WithInProgressStore';
import { Profile } from '../../domain';
import PageContext from '../../context/PageContext';

interface WicketProps {
    inProgressMatchStore: InProgressMatchStore;
    userProfile: Profile;
}

const Wicket = ({ inProgressMatchStore, userProfile }: WicketProps) => {
    const { setOptions } = React.useContext(PageContext);
    React.useEffect(setOptions, []);

    return (
        <WicketComponent
            inProgress={inProgressMatchStore}
            storeMatch={storeMatch(inProgressMatchStore.setId)}
            userProfile={userProfile}
        />
    );
};

export default WithInProgressStore()(inject('inProgressMatchStore')(Wicket));
