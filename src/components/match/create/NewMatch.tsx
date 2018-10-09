import * as React from 'react';
import WithNavBar from '../../WithNavBar';
import MatchForm from './MatchForm';
import { default as createMatch } from '../../../match/create';

const createAndStoreMatch =
    (storeMatch: (match: any) => void, username: string, complete: () => void) =>
        (data: any) => {
            storeMatch(createMatch({ ...data, username }));
            complete();
        };

const NewMatch = ({ userProfile, storage, history, inProgress }: any) => (
    <div className="row">
        <div className="col-1 col-md-2" />
        <div className="col-9 col-md-8">
            <MatchForm
                createMatch={createAndStoreMatch(
                    (match) => {
                        storage.storeMatch(match);
                        inProgress.match = match;
                    },
                    userProfile.id,
                    () => history.replace('/match/start'),
                )}
            />
        </div>
    </div>
);

export default WithNavBar(NewMatch);
