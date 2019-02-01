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
import { UnavailableReason, InningsStatus, MatchResult, MatchType, InProgressMatch, BreakType } from '../../domain';
import calculateResult from '../../match/calculateResult';

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

    const items = [
        { ...allowedOption, text: 'Undo previous', icon: <Undo />, action: props.undoPreviousDelivery },
        { allowed: undoTossAllowed(), text: 'Undo the toss', icon: <Undo />, action: undoToss },
        { ...allowedOption, text: 'Change ends', icon: <SwapHoriz />, action: props.changeEnds },
        {
            ...allowedOption,
            text: 'Change players',
            icon: <Edit />,
            action: () => props.history.push('/match/editplayers'),
        },
        {
            text: 'Change overs',
            icon: <Edit />,
            action: askChangeOvers,
            allowed: props.inProgressMatchStore.match.config.type === MatchType.LimitedOvers,
        },
        {
            ...allowedOption,
            text: 'Edit innings',
            icon: <Edit />,
            action: () => props.history.push('/match/editevents'),
        },
        {
            ...allowedOption,
            text: 'Retired',
            icon: <ArrowRightAlt />,
            action: () => askBatterUnavailable(UnavailableReason.Retired),
        },
        {
            ...allowedOption,
            text: 'Absent',
            icon: <ArrowRightAlt />,
            action: () => askBatterUnavailable(UnavailableReason.Absent),
        },
        { ...allowedOption, text: 'Complete over', icon: <Done />, action: completeOver },
        { ...allowedOption, text: 'Complete innings', icon: <Done />, action: () => setInningsCompleteVerify(true) },
        { ...allowedOption, text: 'Complete match', icon: <DoneAll />, action: () => setMatchCompleteVerify(true) },
        { ...allowedOption, text: 'Start break', icon: <ArrowRightAlt />, action: verifyStartBreak },
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
                    undoPrevious={props.undoPreviousDelivery}
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
                    />
                )}
            {startBreakVerify && <StartBreak startBreak={startBreak} cancel={cancelStartBreak} />}
        </>
    );
};
