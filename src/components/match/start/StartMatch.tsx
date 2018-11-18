import * as React from 'react';
import EditContainer from '../EditContainer';
import StartForm from './StartForm';
import { bindMatchStorage } from '../../../stores/withMatchStorage';
import { Team } from '../../../domain';

const start = (inProgress: any, storeMatch: any, complete: () => void) =>
    bindMatchStorage(storeMatch, () => inProgress)(
        (tossWonBy: Team, battingFirst: Team) => {
            inProgress.startMatch(tossWonBy, battingFirst);
            complete();
        },
    );

export default ({ inProgress, storeMatch, history, classes }: any) => (
    <EditContainer>
        <StartForm
            homeTeam={inProgress.match.homeTeam}
            awayTeam={inProgress.match.awayTeam}
            startMatch={start(inProgress, storeMatch, () => history.replace('/match/inprogress'))}
        />
    </EditContainer>);
