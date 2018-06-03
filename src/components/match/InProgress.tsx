import * as React from 'react';
import { observer } from 'mobx-react';
import * as domain from '../../domain';
import WithNavBar from '../WithNavBar';
import { StartInnings } from './StartInnings';
import { SelectBowler } from './SelectBowler';
import { BallEntry } from './BallEntry';
import { Innings } from '../scorecard/Innings';

export interface InProgressProps {
    inProgress: domain.InProgressMatch;
}

@observer
class InProgress extends React.Component<InProgressProps, {}> {
    ballFunctions = {
        delivery: (deliveryOutcome: domain.DeliveryOutcome, scores: domain.DeliveryScores) => {
            this.props.inProgress.delivery(deliveryOutcome, scores);
        },
        completeOver: () => { this.props.inProgress.completeOver(); },
        changeEnds: () => { this.props.inProgress.flipBatters(); },
    };

    disallowedPlayers = () =>
        typeof this.props.inProgress.previousBowler === 'undefined'
            ? []
            : [this.props.inProgress.previousBowler.playerIndex]

    previousBowlerFromEndIndex = () =>
        typeof this.props.inProgress.previousBowlerFromEnd === 'undefined'
            ? undefined
            : this.props.inProgress.previousBowlerFromEnd.playerIndex;

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
                    initiallySelected={this.previousBowlerFromEndIndex()}
                    disallowedPlayers={this.disallowedPlayers()}
                />);
        }

        if (this.props.inProgress.currentInnings &&
            this.props.inProgress.currentBatter &&
            this.props.inProgress.currentBowler &&
            this.props.inProgress.currentOver) {
            return (
                <div>
                    <BallEntry
                        innings={this.props.inProgress.currentInnings}
                        batter={this.props.inProgress.currentBatter}
                        bowler={this.props.inProgress.currentBowler}
                        overComplete={!!this.props.inProgress.currentOverComplete}
                        currentOver={this.props.inProgress.currentOver}
                        ballFunctions={this.ballFunctions}
                    />
                    <Innings innings={this.props.inProgress.currentInnings} />
                </div>
            );
        }

        return <div />;
    }
}

export default WithNavBar(InProgress);
