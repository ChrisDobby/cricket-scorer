import * as React from 'react';
import { observer } from 'mobx-react';
import * as domain from '../../domain';
import WithNavBar from '../WithNavBar';
import { StartInnings } from './StartInnings';
import { SelectBowler } from './SelectBowler';
import { BallEntry } from './BallEntry';

export interface InProgressProps {
    inProgress: domain.InProgressMatch;
}

@observer
class InProgress extends React.Component<InProgressProps, {}> {
    ballFunctions = {
        dotBall: () => { this.props.inProgress.dotBall(); },
        completeOver: () => { this.props.inProgress.completeOver(); },
    };

    disallowedPlayers = () =>
        typeof this.props.inProgress.previousBowler === 'undefined'
            ? []
            : [this.props.inProgress.previousBowler.playerIndex]

    render() {
        if (this.props.inProgress.match && !this.props.inProgress.currentInnings) {
            return (
                <StartInnings
                    teams={[this.props.inProgress.match.homeTeam, this.props.inProgress.match.awayTeam]}
                    startInnings={this.props.inProgress.startInnings}
                />
            );
        }

        if (this.props.inProgress.currentInnings && !this.props.inProgress.currentBowler) {
            return (
                <SelectBowler
                    bowlingTeam={this.props.inProgress.currentInnings.bowlingTeam}
                    selectBowler={this.props.inProgress.newBowler}
                    disallowedPlayers={this.disallowedPlayers()}
                />);
        }

        if (this.props.inProgress.currentInnings &&
            this.props.inProgress.currentBatter &&
            this.props.inProgress.currentBowler) {
            return (
                <BallEntry
                    innings={this.props.inProgress.currentInnings}
                    batter={this.props.inProgress.currentBatter}
                    bowler={this.props.inProgress.currentBowler}
                    overComplete={!!this.props.inProgress.currentOverComplete}
                    ballFunctions={this.ballFunctions}
                />
            );
        }

        return <div />;
    }
}

export default WithNavBar(InProgress);
