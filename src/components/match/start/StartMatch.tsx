import * as React from 'react';
import WithNavBar from '../../WithNavBar';
import StartForm from './StartForm';
import { bindMatchStorage } from '../../../stores/withMatchStorage';
import { Team } from '../../../domain';

const start = (inProgress: any, storage: any, complete: () => void) =>
    bindMatchStorage(storage.storeMatch, () => inProgress)(
        (tossWonBy: Team, battingFirst: Team) => {
            inProgress.startMatch(tossWonBy, battingFirst);
            complete();
        },
    );

const StartMatch = ({ inProgress, storage, history }: any) => (
    <div className="row">
        <div className="col-1 col-md-2" />
        <div className="col-9 col-md-8">
            <StartForm
                homeTeam={inProgress.match.homeTeam}
                awayTeam={inProgress.match.awayTeam}
                startMatch={start(inProgress, storage, () => history.replace('/match/inprogress'))}
            />
        </div>
    </div>);

export default WithNavBar(StartMatch);
