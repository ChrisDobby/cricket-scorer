import * as React from 'react';
import EditContainer from '../EditContainer';
import EventsForm from './EventsForm';
import { InProgressMatch } from '../../../domain';
import { getTeam } from '../../../match/utilities';
import { bindMatchStorage } from '../../../stores/withMatchStorage';

interface EventsProps {
    inProgress: InProgressMatch;
    storeMatch: any;
    history: any;
}

const rollback = (inProgress: InProgressMatch, storeMatch: any, complete: () => void) =>
    bindMatchStorage(storeMatch, () => inProgress)(
        (eventIndex: number) => {
            inProgress.rollback(eventIndex);
            complete();
        },
    );

export default ({ inProgress, storeMatch, history }: EventsProps) => {
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
                rollback={rollback(inProgress, storeMatch, () => history.replace('/match/inprogress'))}
            />
        </EditContainer>);
};
