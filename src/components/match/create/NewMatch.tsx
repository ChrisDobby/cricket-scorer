import * as React from 'react';
import EditContainer from '../EditContainer';
import MatchForm from './MatchForm';
import { default as createMatch } from '../../../match/create';
import { bindMatchStorage } from '../../../stores/withMatchStorage';
import { Profile, InProgressMatch } from '../../../domain';

interface NewMatchProps {
    userProfile: Profile;
    storeMatch: (match: InProgressMatch) => void;
    history: any;
    inProgress: InProgressMatch;
}

const create = (username: string, inProgress: InProgressMatch, complete: () => void) => (data: any) => {
    const match = createMatch({ ...data, username });
    inProgress.setFromStoredMatch({
        match,
        version: 0,
    });
    complete();
};

export default ({ userProfile, storeMatch, history, inProgress }: NewMatchProps) => (
    <EditContainer>
        <MatchForm
            createMatch={bindMatchStorage(storeMatch, () => inProgress, () => userProfile.id)(
                create(userProfile.id, inProgress, () => history.replace('/match/start')),
            )}
        />
    </EditContainer>);
