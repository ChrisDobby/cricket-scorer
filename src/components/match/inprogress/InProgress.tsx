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
import getPlayers from '../../../match/getPlayers';
import battingMinutes from '../../../match/innings/battingMinutes';

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
    const bindStorage = bindMatchStorage(props.storeMatch, () => props.inProgress, () => props.userProfile.id);

    const ballFunctions = bindStorage({
        delivery: props.inProgress.delivery,
        completeOver: props.inProgress.completeOver,
        undoPreviousDelivery: props.inProgress.undoPreviousDelivery,
        completeInnings: props.inProgress.completeInnings,
        completeMatch: props.inProgress.completeMatch,
    });

    const disallowedPlayers = () =>
        typeof props.inProgress.previousBowler === 'undefined' ? [] : [props.inProgress.previousBowler.playerIndex];

    const previousBowlerFromEndIndex = () =>
        typeof props.inProgress.previousBowlerFromEnd === 'undefined'
            ? undefined
            : props.inProgress.previousBowlerFromEnd.playerIndex;

    const get = (innings: domain.Innings) => getPlayers(props.inProgress.match, innings);

    const calculateMinutes = (innings: domain.BattingInnings) =>
        battingMinutes(() => new Date().getTime())(innings, props.inProgress.match.breaks);

    return (
        <Paper className={props.classes.root}>
            <Observer
                render={() => (
                    <>
                        {!props.inProgress.currentInnings && !props.inProgress.provisionalMatchComplete && (
                            <StartInnings
                                teams={[props.inProgress.match.homeTeam, props.inProgress.match.awayTeam]}
                                startInnings={bindStorage(props.inProgress.startInnings)}
                                defaultBattingTeam={props.inProgress.nextBattingTeam}
                                canChangeBattingTeam={props.inProgress.canSelectBattingTeamForInnings}
                                maximumOvers={props.inProgress.match.config.oversPerSide}
                            />
                        )}
                        {props.inProgress.currentInnings &&
                            !props.inProgress.currentBowler &&
                            props.inProgress.provisionalInningsStatus === domain.InningsStatus.InProgress && (
                                <SelectBowler
                                    bowlingTeam={getTeam(
                                        props.inProgress.match,
                                        props.inProgress.currentInnings.bowlingTeam,
                                    )}
                                    selectBowler={bindStorage(props.inProgress.newBowler)}
                                    initiallySelected={previousBowlerFromEndIndex()}
                                    disallowedPlayers={disallowedPlayers()}
                                />
                            )}
                        {props.inProgress.newBatterRequired &&
                            props.inProgress.provisionalInningsStatus === domain.InningsStatus.InProgress && (
                                <SelectNewBatter
                                    batting={(props.inProgress.currentInnings as domain.Innings).batting}
                                    players={
                                        getTeam(
                                            props.inProgress.match,
                                            (props.inProgress.currentInnings as domain.Innings).battingTeam,
                                        ).players
                                    }
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
                                                    props.inProgress.match,
                                                    props.inProgress.currentInnings.battingTeam,
                                                )}
                                                bowlingTeam={getTeam(
                                                    props.inProgress.match,
                                                    props.inProgress.currentInnings.bowlingTeam,
                                                )}
                                                homeTeam={props.inProgress.match.homeTeam.name}
                                                awayTeam={props.inProgress.match.awayTeam.name}
                                                calculateResult={() => calculateResult(props.inProgress.match)}
                                                delivery={ballFunctions.delivery}
                                                completeOver={ballFunctions.completeOver}
                                            />
                                            <EntryContainer>
                                                <Innings
                                                    innings={props.inProgress.currentInnings}
                                                    getTeam={type => getTeam(props.inProgress.match, type)}
                                                    getBowlerAtIndex={
                                                        get(props.inProgress.currentInnings).getBowlerAtIndex
                                                    }
                                                    getFielderAtIndex={
                                                        get(props.inProgress.currentInnings).getFielderAtIndex
                                                    }
                                                    sameBowlerAndFielder={
                                                        get(props.inProgress.currentInnings).sameBowlerAndFielder
                                                    }
                                                    calculateMinutes={calculateMinutes}
                                                />
                                            </EntryContainer>
                                        </>
                                    )}
                                {typeof props.inProgress.provisionalInningsStatus !== 'undefined' &&
                                    props.inProgress.provisionalInningsStatus !== domain.InningsStatus.InProgress && (
                                        <InningsComplete
                                            status={props.inProgress.provisionalInningsStatus}
                                            battingTeam={
                                                getTeam(
                                                    props.inProgress.match,
                                                    props.inProgress.currentInnings.battingTeam,
                                                ).name
                                            }
                                            complete={() =>
                                                ballFunctions.completeInnings(props.inProgress.provisionalInningsStatus)
                                            }
                                            undoPrevious={ballFunctions.undoPreviousDelivery}
                                        />
                                    )}
                            </>
                        )}
                        {props.inProgress.provisionalMatchComplete && (
                            <CompleteMatch
                                homeTeam={props.inProgress.match.homeTeam.name}
                                awayTeam={props.inProgress.match.awayTeam.name}
                                complete={result => {
                                    ballFunctions.completeMatch(result);
                                    props.history.push('/scorecard');
                                }}
                                disallowCancel
                                cancel={() => {}}
                                calculateResult={() => calculateResult(props.inProgress.match)}
                            />
                        )}
                    </>
                )}
            />
        </Paper>
    );
};

export default withStyles(styles)(withRouter(InProgress));
