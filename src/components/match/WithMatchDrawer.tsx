import * as React from 'react';
import Undo from '@material-ui/icons/Undo';
import SwapHoriz from '@material-ui/icons/SwapHoriz';
import ArrowRightAlt from '@material-ui/icons/ArrowRightAlt';
import Done from '@material-ui/icons/Done';
import DoneAll from '@material-ui/icons/DoneAll';
import Edit from '@material-ui/icons/Edit';
import { History } from 'history';
import MatchDrawer from './MatchDrawer';
import OverNotCompleteWarning from './OverNotCompleteWarning';
import VerifyCompleteInnings from './VerifyCompleteInnings';
import CompleteMatch from './CompleteMatch';
import UpdateOvers from './UpdateOvers';
import BatterUnavailable from './BatterUnavailable';
import StartBreak from './StartBreak';
import ChangeBowler from './ChangeBowler';
import {
    UnavailableReason,
    InningsStatus,
    MatchResult,
    MatchType,
    InProgressMatch,
    BreakType,
    Over,
} from '../../domain';
import calculateResult from '../../match/calculateResult';
import { getTeam } from '../../match/utilities';

const allowedOption = { allowed: true };

interface WithMatchDrawerProps {
    inProgressMatchStore: InProgressMatch;
    completeOver: () => void;
    completeInnings: (status: InningsStatus) => void;
    completeMatch: (result: MatchResult) => void;
    updateOvers: (overs: number) => void;
    startBreak: (type: BreakType) => void;
    undoToss: () => void;
    batterUnavailable: (playerIndex: number, reason: UnavailableReason) => void;
    undoPreviousDelivery: () => void;
    changeEnds: () => void;
    changeBowler: (fromDelivery: number, playerIndex: number) => void;
    history: History;
}

export default (Component: any) => (props: WithMatchDrawerProps) => {
    const [open, setOpen] = React.useState(false);
    const [overNotCompleteWarning, setOverNotCompleteWarning] = React.useState(false);
    const [inningsCompleteVerify, setInningsCompleteVerify] = React.useState(false);
    const [matchCompleteVerify, setMatchCompleteVerify] = React.useState(false);
    const [batterUnavailableVerify, setBatterUnavailableVerify] = React.useState(undefined as
        | UnavailableReason
        | undefined);
    const [changeOvers, setChangeOvers] = React.useState(false);
    const [startBreakVerify, setStartBreakVerify] = React.useState(false);
    const [changeBowlerVerify, setChangeBowlerVerify] = React.useState(false);

    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    const warningYes = () => {
        props.completeOver();
        setOverNotCompleteWarning(false);
    };

    const warningNo = () => {
        setOverNotCompleteWarning(false);
    };

    const completeInnings = (status: InningsStatus) => {
        setInningsCompleteVerify(false);
        props.completeInnings(status);
    };
    const cancelCompleteInnings = () => setInningsCompleteVerify(false);

    const completeMatch = (result: MatchResult) => {
        setMatchCompleteVerify(false);
        props.completeMatch(result);
    };
    const cancelCompleteMatch = () => setMatchCompleteVerify(false);

    const askBatterUnavailable = (unavailableReason: UnavailableReason) => {
        setBatterUnavailableVerify(unavailableReason);
        setOpen(false);
    };
    const batterUnavailable = (playerIndex: number, unavailableReason: UnavailableReason) => {
        setBatterUnavailableVerify(undefined);
        props.batterUnavailable(playerIndex, unavailableReason);
    };
    const cancelBatterUnavailable = () => setBatterUnavailableVerify(undefined);

    const askChangeOvers = () => {
        setChangeOvers(true);
        setOpen(false);
    };
    const updateOvers = (overs: number) => {
        setChangeOvers(false);
        props.updateOvers(overs);
    };
    const cancelChangeOvers = () => setChangeOvers(false);

    const completeOver = () => {
        if (props.inProgressMatchStore.currentOverComplete) {
            props.completeOver();
            return;
        }

        setOverNotCompleteWarning(true);
    };

    const verifyStartBreak = () => {
        setStartBreakVerify(true);
        setOpen(false);
    };
    const startBreak = (breakType: BreakType) => {
        props.startBreak(breakType);
        setStartBreakVerify(false);
    };
    const cancelStartBreak = () => setStartBreakVerify(false);

    const undoTossAllowed = () => !props.inProgressMatchStore.match.innings.find(inn => inn.events.length > 0);
    const undoToss = () => {
        setOpen(false);
        props.undoToss();
        props.history.replace('/match/start');
    };

    const verifyChangeBowler = () => {
        setChangeBowlerVerify(true);
        setOpen(false);
    };
    const changeBowler = (fromDelivery: number, playerIndex: number) => {
        props.changeBowler(fromDelivery, playerIndex);
        setChangeBowlerVerify(false);
    };
    const cancelChangeBowler = () => setChangeBowlerVerify(false);

    const undoPrevious = () => {
        props.undoPreviousDelivery();
        setOpen(false);
    };

    const changeEnds = () => {
        props.changeEnds();
        setOpen(false);
    };

    const items = [
        {
            ...allowedOption,
            text: 'Undo previous',
            icon: <Undo />,
            action: undoPrevious,
            title: 'Undo the previous previous entry',
        },
        {
            allowed: undoTossAllowed(),
            text: 'Undo the toss',
            icon: <Undo />,
            action: undoToss,
            title: 'Go back and change the toss',
        },
        {
            ...allowedOption,
            text: 'Change ends',
            icon: <SwapHoriz />,
            action: changeEnds,
            title: 'Swap the facing batter',
        },
        {
            ...allowedOption,
            text: 'Change bowler',
            icon: <SwapHoriz />,
            action: verifyChangeBowler,
            title: 'Change the bowler for this over',
        },
        {
            ...allowedOption,
            text: 'Change players',
            icon: <Edit />,
            action: () => props.history.push('/match/editplayers'),
            title: 'Change any batter or bowler',
        },
        {
            text: 'Change overs',
            icon: <Edit />,
            action: askChangeOvers,
            allowed: props.inProgressMatchStore.match.config.type === MatchType.LimitedOvers,
            title: 'Change the maximum overs for the innings',
        },
        {
            ...allowedOption,
            text: 'Edit innings',
            icon: <Edit />,
            action: () => props.history.push('/match/editevents'),
            title: 'Go back and change any delivery in the innings',
        },
        {
            ...allowedOption,
            text: 'Edit teams',
            icon: <Edit />,
            action: () => props.history.push('/match/editteams'),
            title: 'Correct any mistakes made when entering the teams',
        },
        {
            ...allowedOption,
            text: 'Retired',
            icon: <ArrowRightAlt />,
            action: () => askBatterUnavailable(UnavailableReason.Retired),
            title: 'Retire a batter',
        },
        {
            ...allowedOption,
            text: 'Absent',
            icon: <ArrowRightAlt />,
            action: () => askBatterUnavailable(UnavailableReason.Absent),
            title: 'Mark a batter as being absent - can be undone',
        },
        {
            ...allowedOption,
            text: 'Complete over',
            icon: <Done />,
            action: completeOver,
            title: 'Complete the current over',
        },
        {
            ...allowedOption,
            text: 'Complete innings',
            icon: <Done />,
            action: () => setInningsCompleteVerify(true),
            title: 'Complete the innings',
        },
        {
            ...allowedOption,
            text: 'Complete match',
            icon: <DoneAll />,
            action: () => setMatchCompleteVerify(true),
            title: 'Complete the match and select a result',
        },
        {
            ...allowedOption,
            text: 'Start break',
            icon: <ArrowRightAlt />,
            action: verifyStartBreak,
            title: 'Start a break in play',
        },
    ];

    return (
        <>
            <Component {...props} openDrawer={openDrawer} />
            <MatchDrawer
                isOpen={open}
                close={closeDrawer}
                open={openDrawer}
                options={items.filter(i => i.allowed)}
                history={props.history}
            />
            {overNotCompleteWarning && <OverNotCompleteWarning yes={warningYes} no={warningNo} />}
            {inningsCompleteVerify && (
                <VerifyCompleteInnings complete={completeInnings} cancel={cancelCompleteInnings} />
            )}
            {matchCompleteVerify && (
                <CompleteMatch
                    homeTeam={props.inProgressMatchStore.match.homeTeam.name}
                    awayTeam={props.inProgressMatchStore.match.awayTeam.name}
                    complete={completeMatch}
                    cancel={cancelCompleteMatch}
                    calculateResult={() => calculateResult(props.inProgressMatchStore.match)}
                />
            )}
            {changeOvers &&
                typeof props.inProgressMatchStore.currentInnings !== 'undefined' &&
                typeof props.inProgressMatchStore.currentInnings.maximumOvers !== 'undefined' && (
                    <UpdateOvers
                        update={updateOvers}
                        cancel={cancelChangeOvers}
                        overs={props.inProgressMatchStore.currentInnings.maximumOvers}
                    />
                )}
            {typeof batterUnavailableVerify !== 'undefined' &&
                typeof props.inProgressMatchStore.currentInnings !== 'undefined' && (
                    <BatterUnavailable
                        innings={props.inProgressMatchStore.currentInnings}
                        reason={batterUnavailableVerify}
                        update={batterUnavailable}
                        cancel={cancelBatterUnavailable}
                        battingPlayers={
                            getTeam(
                                props.inProgressMatchStore.match,
                                props.inProgressMatchStore.currentInnings.battingTeam,
                            ).players
                        }
                    />
                )}
            {startBreakVerify && <StartBreak startBreak={startBreak} cancel={cancelStartBreak} />}
            {changeBowlerVerify &&
                props.inProgressMatchStore.currentInnings &&
                props.inProgressMatchStore.currentBowler &&
                props.inProgressMatchStore.currentOver && (
                    <ChangeBowler
                        changeForFullOver={playerIndex => changeBowler(0, playerIndex)}
                        changeFromNow={playerIndex =>
                            changeBowler(
                                (props.inProgressMatchStore.currentOver as Over).deliveries.length + 1,
                                playerIndex,
                            )
                        }
                        changeFromDelivery={changeBowler}
                        currentDelivery={(props.inProgressMatchStore.currentOver as Over).deliveries.length + 1}
                        cancel={cancelChangeBowler}
                        innings={props.inProgressMatchStore.currentInnings}
                        overNumber={props.inProgressMatchStore.currentInnings.completedOvers + 1}
                        currentPlayerIndex={props.inProgressMatchStore.currentBowler.playerIndex}
                        bowlingPlayers={
                            getTeam(
                                props.inProgressMatchStore.match,
                                props.inProgressMatchStore.currentInnings.bowlingTeam,
                            ).players
                        }
                    />
                )}
        </>
    );
};
