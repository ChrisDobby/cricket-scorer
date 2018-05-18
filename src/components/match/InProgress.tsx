import * as React from 'react';
import { observer } from 'mobx-react';
import WithNavBar from '../WithNavBar';
import { StartInnings } from './StartInnings';
import { SelectBowler } from './SelectBowler';
import { BallEntry } from './BallEntry';
import inProgressMatchStore from '../../stores/inProgressMatchStore';

@observer
class InProgress extends React.Component {
    ballFunctions = {
        dotBall: () => { inProgressMatchStore.dotBall(); },
        completeOver: () => { inProgressMatchStore.completeOver(); },
    };

    render() {
        if (inProgressMatchStore.match && !inProgressMatchStore.currentInnings) {
            return (
                <StartInnings
                    teams={[inProgressMatchStore.match.homeTeam, inProgressMatchStore.match.awayTeam]}
                    startInnings={inProgressMatchStore.startInnings}
                />
            );
        }

        if (inProgressMatchStore.currentInnings && !inProgressMatchStore.currentBowler) {
            return (
                <SelectBowler
                    bowlingTeam={inProgressMatchStore.currentInnings.bowlingTeam}
                    selectBowler={inProgressMatchStore.newBowler}
                />);
        }

        if (inProgressMatchStore.currentInnings &&
            inProgressMatchStore.currentBatter &&
            inProgressMatchStore.currentBowler) {
            return (
                <BallEntry
                    innings={inProgressMatchStore.currentInnings}
                    batter={inProgressMatchStore.currentBatter}
                    bowler={inProgressMatchStore.currentBowler}
                    overComplete={!!inProgressMatchStore.currentOverComplete}
                    ballFunctions={this.ballFunctions}
                />
            );
        }

        return <div />;
    }
}

export default WithNavBar(InProgress);
