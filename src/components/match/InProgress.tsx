import * as React from 'react';
import { observer } from 'mobx-react';
import * as domain from '../../domain';
import WithNavBar from '../WithNavBar';
import { StartInnings } from './StartInnings';
import { SelectBowler } from './SelectBowler';
import { BallEntry } from './BallEntry';
import { Innings } from '../scorecard/Innings';
import SelectNewBatter from './SelectNewBatter';
import { bindMatchStorage } from '../../stores/withMatchStorage';

export interface InProgressProps {
    inProgress: domain.InProgressMatch;
    storage: any;
}

@observer
class InProgress extends React.Component<InProgressProps, {}> {
    bindStorage = bindMatchStorage(this.props.storage.storeMatch, () => this.props.inProgress);
    ballFunctions = this.bindStorage({
        delivery: this.props.inProgress.delivery,
        completeOver: this.props.inProgress.completeOver,
        changeEnds: this.props.inProgress.flipBatters,
    });

    disallowedPlayers = () =>
        typeof this.props.inProgress.previousBowler === 'undefined'
            ? []
            : [this.props.inProgress.previousBowler.playerIndex]

    previousBowlerFromEndIndex = () =>
        typeof this.props.inProgress.previousBowlerFromEnd === 'undefined'
            ? undefined
            : this.props.inProgress.previousBowlerFromEnd.playerIndex

    render() {
        if (this.props.inProgress.match && !this.props.inProgress.currentInnings) {
            return (
                <StartInnings
                    teams={[this.props.inProgress.match.homeTeam, this.props.inProgress.match.awayTeam]}
                    startInnings={this.bindStorage(this.props.inProgress.startInnings)}
                />
            );
        }

        if (this.props.inProgress.currentInnings && !this.props.inProgress.currentBowler) {
            return (
                <SelectBowler
                    bowlingTeam={this.props.inProgress.currentInnings.bowlingTeam}
                    selectBowler={this.bindStorage(this.props.inProgress.newBowler)}
                    initiallySelected={this.previousBowlerFromEndIndex()}
                    disallowedPlayers={this.disallowedPlayers()}
                />);
        }

        if (this.props.inProgress.currentInnings &&
            this.props.inProgress.currentInnings.batting.batters
                .filter(batter => batter.innings && !batter.innings.wicket).length === 1) {
            return (
                <SelectNewBatter
                    batting={this.props.inProgress.currentInnings.batting}
                    players={this.props.inProgress.currentInnings.battingTeam.players}
                    batterSelected={this.bindStorage(this.props.inProgress.newBatter)}
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
