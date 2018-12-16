import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react';
import { History } from 'history';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import * as domain from '../../../domain';
import StartInnings from './StartInnings';
import SelectBowler from './SelectBowler';
import BallEntry from './BallEntry';
import Innings from '../../scorecard/Innings';
import SelectNewBatter from './SelectNewBatter';
import InningsComplete from './InningsComplete';
import CompleteMatch from '../CompleteMatch';
import EntryContainer from './EntryContainer';
import { bindMatchStorage } from '../../../stores/withMatchStorage';
import { getTeam } from '../../../match/utilities';
import calculateResult from '../../../match/calculateResult';

const styles = (theme: any) => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: '20px',
    },
});

type InProgressProps = RouteComponentProps<{}> & {
    inProgress: domain.InProgressMatch;
    storeMatch: (m: domain.InProgressMatch) => void;
    history: History;
    classes: any;
    userProfile: domain.Profile;
};

@observer
class InProgress extends React.Component<InProgressProps, {}> {
    bindStorage = bindMatchStorage(this.props.storeMatch, () => this.props.inProgress, () => this.props.userProfile.id);
    ballFunctions = this.bindStorage({
        delivery: this.props.inProgress.delivery,
        completeOver: this.props.inProgress.completeOver,
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
        const currentInnings = this.props.inProgress.currentInnings as domain.Innings;
        return (
            <Paper className={this.props.classes.root}>
                {match && !this.props.inProgress.currentInnings && !shouldBeComplete &&
                    <StartInnings
                        teams={[match.homeTeam, match.awayTeam]}
                        startInnings={this.bindStorage(this.props.inProgress.startInnings)}
                        defaultBattingTeam={this.props.inProgress.nextBattingTeam}
                        canChangeBattingTeam={this.props.inProgress.canSelectBattingTeamForInnings}
                        maximumOvers={this.props.inProgress.match.config.oversPerSide}
                    />}
                {this.props.inProgress.currentInnings && !this.props.inProgress.currentBowler &&
                    inningsStatus === domain.InningsStatus.InProgress &&
                    <SelectBowler
                        bowlingTeam={getTeam(match, this.props.inProgress.currentInnings.bowlingTeam)}
                        selectBowler={this.bindStorage(this.props.inProgress.newBowler)}
                        initiallySelected={this.previousBowlerFromEndIndex()}
                        disallowedPlayers={this.disallowedPlayers()}
                    />}
                {this.props.inProgress.newBatterRequired && inningsStatus === domain.InningsStatus.InProgress &&
                    <SelectNewBatter
                        batting={currentInnings.batting}
                        players={getTeam(match, currentInnings.battingTeam).players}
                        batterSelected={this.bindStorage(this.props.inProgress.newBatter)}
                    />}
                {this.props.inProgress.currentInnings &&
                    <React.Fragment>
                        {this.props.inProgress.currentBatter &&
                            this.props.inProgress.currentBowler &&
                            this.props.inProgress.currentOver &&
                            !this.props.inProgress.newBatterRequired &&
                            <React.Fragment>
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
                                    delivery={this.ballFunctions.delivery}
                                    completeOver={this.ballFunctions.completeOver}
                                />
                                <EntryContainer>
                                    <Innings
                                        innings={this.props.inProgress.currentInnings}
                                        getTeam={type => getTeam(match, type)}
                                    />
                                </EntryContainer>
                            </React.Fragment>}
                        {typeof inningsStatus !== 'undefined' && inningsStatus !== domain.InningsStatus.InProgress &&
                            <InningsComplete
                                status={inningsStatus}
                                battingTeam={getTeam(match, this.props.inProgress.currentInnings.battingTeam).name}
                                complete={() => this.ballFunctions.completeInnings(inningsStatus)}
                                undoPrevious={this.ballFunctions.undoPreviousDelivery}
                            />}
                        {shouldBeComplete &&
                            <CompleteMatch
                                homeTeam={match.homeTeam.name}
                                awayTeam={match.awayTeam.name}
                                disallowCancel
                                complete={this.ballFunctions.completeMatch}
                                cancel={() => { }}
                                calculateResult={() => calculateResult(match)}
                                undoPrevious={this.ballFunctions.undoPreviousDelivery}
                            />}
                    </React.Fragment>}
            </Paper>);
    }
}

export default withStyles(styles)(withRouter(InProgress));
