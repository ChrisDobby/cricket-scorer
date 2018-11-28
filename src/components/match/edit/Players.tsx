import * as React from 'react';
import EditContainer from '../EditContainer';
import PlayersForm from './PlayersForm';
import { InProgressMatch } from '../../../domain';
import { getTeam } from '../../../match/utilities';
import { bindMatchStorage } from '../../../stores/withMatchStorage';

interface PlayersProps {
    inProgress: InProgressMatch;
    storeMatch: any;
    history: any;
}

const update = (inProgress: InProgressMatch, storeMatch: any, complete: () => void) =>
    bindMatchStorage(storeMatch, () => inProgress)(
        (battingOrder: number[], bowlingOrder: number[]) => {
            inProgress.changeOrders(battingOrder, bowlingOrder);
            complete();
        },
    );

export default ({ inProgress, storeMatch, history }: PlayersProps) => {
    if (typeof inProgress.currentInnings === 'undefined') {
        return null;
    }

    return (
        <EditContainer>
            <PlayersForm
                batters={inProgress.currentInnings.batting.batters}
                bowlers={inProgress.currentInnings.bowlers}
                battingTeam={getTeam(inProgress.match, inProgress.currentInnings.battingTeam).players}
                bowlingTeam={getTeam(inProgress.match, inProgress.currentInnings.bowlingTeam).players}
                save={update(inProgress, storeMatch, () => history.replace('/match/inprogress'))}
            />
        </EditContainer>);
};
