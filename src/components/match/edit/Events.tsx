import * as React from 'react';
import { History } from 'history';
import EditContainer from '../EditContainer';
import EventsForm from './EventsForm';
import { InProgressMatch, Profile } from '../../../domain';
import { getTeam } from '../../../match/utilities';
import { bindMatchStorage } from '../../../stores/withMatchStorage';

interface EventsProps {
    inProgress: InProgressMatch;
    storeMatch: (match: InProgressMatch) => void;
    history: History;
    userProfile: Profile;
}

const rollback = (
    inProgress: InProgressMatch,
    storeMatch: (match: InProgressMatch) => void,
    complete: () => void,
    getUserId: () => string,
) =>
    bindMatchStorage(storeMatch, () => inProgress, getUserId)((eventIndex: number) => {
        inProgress.rollback(eventIndex);
        complete();
    });

export default ({ inProgress, storeMatch, history, userProfile }: EventsProps) => {
    if (typeof inProgress.currentInnings === 'undefined') {
        return null;
    }

    return (
        <EditContainer>
            <EventsForm
                config={inProgress.match.config}
                innings={inProgress.currentInnings}
                battingPlayers={getTeam(inProgress.match, inProgress.currentInnings.battingTeam).players}
                bowlingPlayers={getTeam(inProgress.match, inProgress.currentInnings.bowlingTeam).players}
                rolledBackInnings={inProgress.rolledBackInnings}
                rollback={rollback(
                    inProgress,
                    storeMatch,
                    () => history.replace('/match/inprogress'),
                    () => userProfile.id,
                )}
            />
        </EditContainer>
    );
};
