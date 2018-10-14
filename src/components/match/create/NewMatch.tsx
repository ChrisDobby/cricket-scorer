import * as React from 'react';
import MatchForm from './MatchForm';
import { default as createMatch } from '../../../match/create';
import { InProgressMatchStore } from '../../../stores/inProgressMatchStore';
import { bindMatchStorage } from '../../../stores/withMatchStorage';

const create = (username: string, inProgress: InProgressMatchStore, complete: () => void) => (data: any) => {
    const match = createMatch({ ...data, username });
    inProgress.match = match;
    complete();
};

const NewMatch = ({ userProfile, storeMatch, history, inProgress }: any) => (
    <div className="row">
        <div className="col-1 col-md-2" />
        <div className="col-9 col-md-8">
            <MatchForm
                createMatch={bindMatchStorage(storeMatch, () => inProgress)(
                    create(userProfile.id, inProgress, () => history.replace('/match/start')),
                )}
            />
        </div>
    </div>
);

export default NewMatch;
