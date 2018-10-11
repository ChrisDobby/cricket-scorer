import * as React from 'react';
import { observer } from 'mobx-react';
import * as domain from '../../../domain';
import WithNavBar from '../../WithNavBar';
import { StartInnings } from './StartInnings';
import { SelectBowler } from './SelectBowler';
import { BallEntry } from './BallEntry';
import { Innings } from '../../scorecard/Innings';
import SelectNewBatter from './SelectNewBatter';
import InningsComplete from './InningsComplete';
import { bindMatchStorage } from '../../../stores/withMatchStorage';
import { getTeam } from '../../../match/utilities';

export interface InProgressProps {
    inProgress: domain.InProgressMatch;
    storage: any;
}

@observer
class InProgress extends React.Component<InProgressProps, {}> {
    bindStorage = bindMatchStorage(this.props.storage.storeMatch, () => this.props.inProgress);
    ballFunctions = this.bindStorage({
        delivery: this.props.inProgress.delivery,
        undoPreviousDelivery: this.props.inProgress.undoPreviousDelivery,
        completeOver: this.props.inProgress.completeOver,
        changeEnds: this.props.inProgress.flipBatters,
        completeInnings: this.props.inProgress.completeInnings,
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
        const inningsStatus = this.props.inProgress.provisionalInningsStatus;
        if (this.props.inProgress.match && this.props.inProgress.match.toss && !this.props.inProgress.currentInnings) {
            return (
                <StartInnings
                    teams={[this.props.inProgress.match.homeTeam, this.props.inProgress.match.awayTeam]}
                    startInnings={this.bindStorage(this.props.inProgress.startInnings)}
                    defaultBattingTeam={this.props.inProgress.nextBattingTeam}
                    canChangeBattingTeam={this.props.inProgress.canSelectBattingTeamForInnings}
                />
            );
        }

        if (this.props.inProgress.currentInnings && !this.props.inProgress.currentBowler &&
            inningsStatus === domain.InningsStatus.InProgress) {
            return (
                <SelectBowler
                    bowlingTeam={getTeam(
                        this.props.inProgress.match as domain.Match, this.props.inProgress.currentInnings.bowlingTeam)}
                    selectBowler={this.bindStorage(this.props.inProgress.newBowler)}
                    initiallySelected={this.previousBowlerFromEndIndex()}
                    disallowedPlayers={this.disallowedPlayers()}
                />);
        }

        if (inningsStatus === domain.InningsStatus.InProgress &&
            this.props.inProgress.currentInnings &&
            this.props.inProgress.currentInnings.batting.batters
                .filter(batter => batter.innings && !batter.innings.wicket).length === 1) {
            return (
                <SelectNewBatter
                    batting={this.props.inProgress.currentInnings.batting}
                    players={getTeam(
                        this.props.inProgress.match as domain.Match,
                        this.props.inProgress.currentInnings.battingTeam)
                        .players}
                    batterSelected={this.bindStorage(this.props.inProgress.newBatter)}
                />);
        }

        if (this.props.inProgress.currentInnings) {
            return (
                <React.Fragment>
                    <div>
                        {this.props.inProgress.currentBatter &&
                            this.props.inProgress.currentBowler &&
                            this.props.inProgress.currentOver &&
                            <BallEntry
                                innings={this.props.inProgress.currentInnings}
                                batter={this.props.inProgress.currentBatter}
                                bowler={this.props.inProgress.currentBowler}
                                overComplete={!!this.props.inProgress.currentOverComplete}
                                currentOver={this.props.inProgress.currentOver}
                                battingTeam={getTeam(
                                    this.props.inProgress.match as domain.Match,
                                    this.props.inProgress.currentInnings.battingTeam)}
                                ballFunctions={this.ballFunctions}
                            />}
                        <Innings
                            innings={this.props.inProgress.currentInnings}
                            getTeam={type => getTeam(this.props.inProgress.match as domain.Match, type)}
                        />
                    </div>
                    {typeof inningsStatus !== 'undefined' && inningsStatus !== domain.InningsStatus.InProgress &&
                        <InningsComplete
                            status={inningsStatus}
                            battingTeam={getTeam(
                                this.props.inProgress.match as domain.Match,
                                this.props.inProgress.currentInnings.battingTeam).name}
                            complete={() => this.ballFunctions.completeInnings(inningsStatus)}
                        />}
                </React.Fragment>
            );
        }

        return <div />;
    }
}

export default WithNavBar(InProgress);
