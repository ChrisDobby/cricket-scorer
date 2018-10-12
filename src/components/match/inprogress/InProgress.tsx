import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react';
import { History } from 'history';
import * as domain from '../../../domain';
import { StartInnings } from './StartInnings';
import { SelectBowler } from './SelectBowler';
import { BallEntry } from './BallEntry';
import { Innings } from '../../scorecard/Innings';
import SelectNewBatter from './SelectNewBatter';
import InningsComplete from './InningsComplete';
import MatchComplete from './MatchComplete';
import { bindMatchStorage } from '../../../stores/withMatchStorage';
import { getTeam } from '../../../match/utilities';
import calculateResult from '../../../match/calculateResult';

type InProgressProps = RouteComponentProps<{}> & {
    inProgress: domain.InProgressMatch;
    storage: any;
    history: History;
};

@observer
class InProgress extends React.Component<InProgressProps, {}> {
    bindStorage = bindMatchStorage(this.props.storage.storeMatch, () => this.props.inProgress);
    ballFunctions = this.bindStorage({
        delivery: this.props.inProgress.delivery,
        undoPreviousDelivery: this.props.inProgress.undoPreviousDelivery,
        completeOver: this.props.inProgress.completeOver,
        changeEnds: this.props.inProgress.flipBatters,
        completeInnings: this.props.inProgress.completeInnings,
        completeMatch: this.props.inProgress.completeMatch,
    });

    disallowedPlayers = () =>
        typeof this.props.inProgress.previousBowler === 'undefined'
            ? []
            : [this.props.inProgress.previousBowler.playerIndex]

    previousBowlerFromEndIndex = () =>
        typeof this.props.inProgress.previousBowlerFromEnd === 'undefined'
            ? undefined
            : this.props.inProgress.previousBowlerFromEnd.playerIndex

    redirectIfRequired = () => {
        if (typeof this.props.inProgress.match === 'undefined') { return; }

        if (typeof this.props.inProgress.match.toss === 'undefined') {
            this.props.history.replace('/match/start');
            return;
        }

        if (this.props.inProgress.match.complete) {
            this.props.history.replace('/scorecard');
            return;
        }
    }

    componentDidUpdate() {
        this.redirectIfRequired();
    }

    componentDidMount() {
        this.redirectIfRequired();
    }

    render() {
        const inningsStatus = this.props.inProgress.provisionalInningsStatus;
        const shouldBeComplete = this.props.inProgress.provisionalMatchComplete;
        const match = this.props.inProgress.match as domain.Match;
        if (match && !this.props.inProgress.currentInnings) {
            return (
                <StartInnings
                    teams={[match.homeTeam, match.awayTeam]}
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
                    bowlingTeam={getTeam(match, this.props.inProgress.currentInnings.bowlingTeam)}
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
                    players={getTeam(match, this.props.inProgress.currentInnings.battingTeam).players}
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
                                battingTeam={getTeam(match, this.props.inProgress.currentInnings.battingTeam)}
                                homeTeam={match.homeTeam.name}
                                awayTeam={match.awayTeam.name}
                                calculateResult={() => calculateResult(match)}
                                ballFunctions={this.ballFunctions}
                            />}
                        <Innings
                            innings={this.props.inProgress.currentInnings}
                            getTeam={type => getTeam(match, type)}
                        />
                    </div>
                    {typeof inningsStatus !== 'undefined' && inningsStatus !== domain.InningsStatus.InProgress &&
                        <InningsComplete
                            status={inningsStatus}
                            battingTeam={getTeam(match, this.props.inProgress.currentInnings.battingTeam).name}
                            complete={() => this.ballFunctions.completeInnings(inningsStatus)}
                        />}
                    {shouldBeComplete &&
                        <MatchComplete
                            homeTeam={match.homeTeam.name}
                            awayTeam={match.awayTeam.name}
                            disallowCancel
                            complete={this.ballFunctions.completeMatch}
                            cancel={() => { }}
                            calculateResult={() => calculateResult(match)}
                        />}
                </React.Fragment>);
        }

        return <div />;
    }
}

export default withRouter(InProgress);
