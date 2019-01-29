import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Observer } from 'mobx-react';
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

const InProgress = (props: InProgressProps) => {
    const inningsStatus = props.inProgress.provisionalInningsStatus;
    const shouldBeComplete = props.inProgress.provisionalMatchComplete;
    const match = props.inProgress.match as domain.Match;
    const currentInnings = props.inProgress.currentInnings as domain.Innings;

    const bindStorage = bindMatchStorage(props.storeMatch, () => props.inProgress, () => props.userProfile.id);

    const ballFunctions = bindStorage({
        delivery: props.inProgress.delivery,
        completeOver: props.inProgress.completeOver,
    });

    const disallowedPlayers = () =>
        typeof props.inProgress.previousBowler === 'undefined' ? [] : [props.inProgress.previousBowler.playerIndex];

    const previousBowlerFromEndIndex = () =>
        typeof props.inProgress.previousBowlerFromEnd === 'undefined'
            ? undefined
            : props.inProgress.previousBowlerFromEnd.playerIndex;

    React.useEffect(() => {
        if (typeof props.inProgress.match === 'undefined') {
            return;
        }

        if (typeof props.inProgress.match.toss === 'undefined') {
            props.history.replace('/match/start');
            return;
        }

        if (props.inProgress.match.complete) {
            props.history.replace('/scorecard');
            return;
        }
    });

    return (
        <Paper className={props.classes.root}>
            <Observer
                render={() => (
                    <>
                        {match && !props.inProgress.currentInnings && !shouldBeComplete && (
                            <StartInnings
                                teams={[match.homeTeam, match.awayTeam]}
                                startInnings={bindStorage(props.inProgress.startInnings)}
                                defaultBattingTeam={props.inProgress.nextBattingTeam}
                                canChangeBattingTeam={props.inProgress.canSelectBattingTeamForInnings}
                                maximumOvers={props.inProgress.match.config.oversPerSide}
                            />
                        )}
                        {props.inProgress.currentInnings &&
                            !props.inProgress.currentBowler &&
                            inningsStatus === domain.InningsStatus.InProgress && (
                                <SelectBowler
                                    bowlingTeam={getTeam(match, props.inProgress.currentInnings.bowlingTeam)}
                                    selectBowler={bindStorage(props.inProgress.newBowler)}
                                    initiallySelected={previousBowlerFromEndIndex()}
                                    disallowedPlayers={disallowedPlayers()}
                                />
                            )}
                        {props.inProgress.newBatterRequired && inningsStatus === domain.InningsStatus.InProgress && (
                            <SelectNewBatter
                                batting={currentInnings.batting}
                                players={getTeam(match, currentInnings.battingTeam).players}
                                batterSelected={bindStorage(props.inProgress.newBatter)}
                            />
                        )}
                        {props.inProgress.currentInnings && (
                            <>
                                {props.inProgress.currentBatter &&
                                    props.inProgress.currentBowler &&
                                    props.inProgress.currentOver &&
                                    !props.inProgress.newBatterRequired && (
                                        <>
                                            <BallEntry
                                                innings={props.inProgress.currentInnings}
                                                batter={props.inProgress.currentBatter}
                                                bowler={props.inProgress.currentBowler}
                                                overComplete={!!props.inProgress.currentOverComplete}
                                                currentOver={props.inProgress.currentOver}
                                                battingTeam={getTeam(
                                                    match,
                                                    props.inProgress.currentInnings.battingTeam,
                                                )}
                                                homeTeam={match.homeTeam.name}
                                                awayTeam={match.awayTeam.name}
                                                calculateResult={() => calculateResult(match)}
                                                delivery={ballFunctions.delivery}
                                                completeOver={ballFunctions.completeOver}
                                            />
                                            <EntryContainer>
                                                <Innings
                                                    innings={props.inProgress.currentInnings}
                                                    getTeam={type => getTeam(match, type)}
                                                />
                                            </EntryContainer>
                                        </>
                                    )}
                                {typeof inningsStatus !== 'undefined' &&
                                    inningsStatus !== domain.InningsStatus.InProgress && (
                                        <InningsComplete
                                            status={inningsStatus}
                                            battingTeam={
                                                getTeam(match, props.inProgress.currentInnings.battingTeam).name
                                            }
                                            complete={() => ballFunctions.completeInnings(inningsStatus)}
                                            undoPrevious={ballFunctions.undoPreviousDelivery}
                                        />
                                    )}
                                {shouldBeComplete && (
                                    <CompleteMatch
                                        homeTeam={match.homeTeam.name}
                                        awayTeam={match.awayTeam.name}
                                        disallowCancel
                                        complete={ballFunctions.completeMatch}
                                        cancel={() => {}}
                                        calculateResult={() => calculateResult(match)}
                                        undoPrevious={ballFunctions.undoPreviousDelivery}
                                    />
                                )}
                            </>
                        )}
                    </>
                )}
            />
        </Paper>
    );
};

export default withStyles(styles)(withRouter(InProgress));
