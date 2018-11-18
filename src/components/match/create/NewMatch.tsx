import * as React from 'react';
import EditContainer from '../EditContainer';
import MatchForm from './MatchForm';
import { default as createMatch } from '../../../match/create';
import { InProgressMatchStore } from '../../../stores/inProgressMatchStore';
import { bindMatchStorage } from '../../../stores/withMatchStorage';

const create = (username: string, inProgress: InProgressMatchStore, complete: () => void) => (data: any) => {
    const match = createMatch({ ...data, username });
    inProgress.setFromStoredMatch({
        match,
        version: 0,
    });
    complete();
};

export default ({ userProfile, storeMatch, history, inProgress }: any) => (
    <EditContainer>
        <MatchForm
            createMatch={bindMatchStorage(storeMatch, () => inProgress)(
                create(userProfile.id, inProgress, () => history.replace('/match/start')),
            )}
        />
    </EditContainer>);
