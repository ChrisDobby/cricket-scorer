import * as React from 'react';
import EditContainer from '../EditContainer';
import StartForm from './StartForm';
import { bindMatchStorage } from '../../../stores/withMatchStorage';
import { Team } from '../../../domain';

const start = (inProgress: any, storeMatch: any, complete: () => void, getUserId: () => string) =>
    bindMatchStorage(storeMatch, () => inProgress, getUserId)(
        (tossWonBy: Team, battingFirst: Team) => {
            inProgress.startMatch(tossWonBy, battingFirst);
            complete();
        },
    );

export default ({ inProgress, storeMatch, history, userProfile }: any) => (
    <EditContainer>
        <StartForm
            homeTeam={inProgress.match.homeTeam}
            awayTeam={inProgress.match.awayTeam}
            startMatch={start(
                inProgress,
                storeMatch,
                () => history.replace('/match/inprogress'),
                () => userProfile.id)}
        />
    </EditContainer>);
