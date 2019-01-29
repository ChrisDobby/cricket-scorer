import * as React from 'react';
import { History } from 'history';
import EditContainer from '../EditContainer';
import StartForm from './StartForm';
import { bindMatchStorage } from '../../../stores/withMatchStorage';
import { InProgressMatch, TeamType, Profile } from '../../../domain';

interface StartMatchProps {
    inProgress: InProgressMatch;
    storeMatch: (match: InProgressMatch) => void;
    history: History;
    userProfile: Profile;
}

const start = (
    inProgress: InProgressMatch,
    storeMatch: (match: InProgressMatch) => void,
    complete: () => void,
    getUserId: () => string,
) =>
    bindMatchStorage(storeMatch, () => inProgress, getUserId)((tossWonBy: TeamType, battingFirst: TeamType) => {
        inProgress.startMatch(tossWonBy, battingFirst);
        complete();
    });

export default ({ inProgress, storeMatch, history, userProfile }: StartMatchProps) => (
    <EditContainer>
        <StartForm
            homeTeam={inProgress.match.homeTeam}
            awayTeam={inProgress.match.awayTeam}
            startMatch={start(inProgress, storeMatch, () => history.replace('/match/inprogress'), () => userProfile.id)}
        />
    </EditContainer>
);
