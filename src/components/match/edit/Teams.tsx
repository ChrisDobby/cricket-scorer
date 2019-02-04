import * as React from 'react';
import { History } from 'history';
import EditContainer from '../EditContainer';
import TeamsForm from './TeamsForm';
import { InProgressMatch, Profile } from '../../../domain';
import { bindMatchStorage } from '../../../stores/withMatchStorage';

interface TeamsProps {
    inProgress: InProgressMatch;
    storeMatch: (match: InProgressMatch) => void;
    history: History;
    userProfile: Profile;
}

const update = (
    inProgress: InProgressMatch,
    storeMatch: (match: InProgressMatch) => void,
    complete: () => void,
    getUserId: () => string,
) =>
    bindMatchStorage(storeMatch, () => inProgress, getUserId)(
        (homeTeam: string, awayTeam: string, homePlayers: string[], awayPlayers: string[]) => {
            inProgress.updateTeams(homeTeam, awayTeam, homePlayers, awayPlayers);
            complete();
        },
    );

export default ({ inProgress, storeMatch, history, userProfile }: TeamsProps) => {
    return (
        <EditContainer>
            <TeamsForm
                homeTeam={inProgress.match.homeTeam.name}
                awayTeam={inProgress.match.awayTeam.name}
                homePlayers={inProgress.match.homeTeam.players}
                awayPlayers={inProgress.match.awayTeam.players}
                save={update(inProgress, storeMatch, () => history.replace('/match/inprogress'), () => userProfile.id)}
            />
        </EditContainer>
    );
};
