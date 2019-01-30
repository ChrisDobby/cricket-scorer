import * as React from 'react';
import EditContainer from '../EditContainer';
import MatchForm from './MatchForm';
import { History } from 'history';
import { default as createMatch } from '../../../match/create';
import { bindMatchStorage } from '../../../stores/withMatchStorage';
import { Profile, InProgressMatch, StoredMatch } from '../../../domain';
import { OFFLINE } from '../../../context/networkStatus';
import OverwriteWarningDialog from './OverwriteWarningDialog';

interface NewMatchProps {
    userProfile: Profile;
    storedMatch: StoredMatch | undefined;
    storeMatch: (match: InProgressMatch) => void;
    history: History;
    inProgress: InProgressMatch;
    status: string;
}

const create = (username: string, inProgress: InProgressMatch, complete: () => void) => (data: any) => {
    const match = createMatch({ ...data, username });
    inProgress.setFromStoredMatch({
        match,
        version: 0,
        lastEvent: undefined,
    });
    complete();
};

export default (props: NewMatchProps) => {
    const [checkOverwrite, setCheckOverwrite] = React.useState(props.status === OFFLINE && props.storedMatch);

    return (
        <>
            <EditContainer>
                <MatchForm
                    createMatch={bindMatchStorage(props.storeMatch, () => props.inProgress, () => props.userProfile.id)(
                        create(props.userProfile.id, props.inProgress, () => props.history.replace('/match/start')),
                    )}
                />
            </EditContainer>
            {checkOverwrite && (
                <OverwriteWarningDialog
                    storedMatch={(props.storedMatch as StoredMatch).match}
                    onYes={() => setCheckOverwrite(false)}
                    onNo={() => props.history.goBack()}
                />
            )}
        </>
    );
};
