import * as React from 'react';
import { History } from 'history';
import EditContainer from '../EditContainer';
import PlayersForm from './PlayersForm';
import { InProgressMatch, Profile } from '../../../domain';
import { getTeam } from '../../../match/utilities';
import { bindMatchStorage } from '../../../stores/withMatchStorage';
import getPlayers from '../../../match/getPlayers';

interface PlayersProps {
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
    bindMatchStorage(storeMatch, () => inProgress, getUserId)((battingOrder: number[], bowlingOrder: number[]) => {
        inProgress.changeOrders(battingOrder, bowlingOrder);
        complete();
    });

export default ({ inProgress, storeMatch, history, userProfile }: PlayersProps) => {
    if (typeof inProgress.currentInnings === 'undefined') {
        return null;
    }

    const get = getPlayers(inProgress.match, inProgress.currentInnings);
    return (
        <EditContainer>
            <PlayersForm
                batters={inProgress.currentInnings.batting.batters}
                bowlers={inProgress.currentInnings.bowlers}
                battingTeam={getTeam(inProgress.match, inProgress.currentInnings.battingTeam).players}
                bowlingTeam={getTeam(inProgress.match, inProgress.currentInnings.bowlingTeam).players}
                getBowlerAtIndex={get.getBowlerAtIndex}
                getFielderAtIndex={get.getFielderAtIndex}
                sameBowlerAndFielder={get.sameBowlerAndFielder}
                save={update(inProgress, storeMatch, () => history.replace('/match/inprogress'), () => userProfile.id)}
            />
        </EditContainer>
    );
};
