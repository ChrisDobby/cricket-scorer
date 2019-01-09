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
import { UnavailableReason, InningsStatus, MatchResult, MatchType, InProgressMatch } from '../../domain';
import calculateResult from '../../match/calculateResult';

const allowedOption = { allowed: true };

interface WithMatchDrawerProps {
    inProgressMatchStore: InProgressMatch;
    completeOver: () => void;
    completeInnings: (status: InningsStatus) => void;
    completeMatch: (result: MatchResult) => void;
    updateOvers: (overs: number) => void;
    batterUnavailable: (reason: UnavailableReason) => void;
    undoPreviousDelivery: () => void;
    changeEnds: () => void;
    history: History;
}

export default (Component: any) => (props: WithMatchDrawerProps) => {
    const [open, setOpen] = React.useState(false);
    const [overNotCompleteWarning, setOverNotCompleteWarning] = React.useState(false);
    const [inningsCompleteVerify, setInningsCompleteVerify] = React.useState(false);
    const [matchCompleteVerify, setMatchCompleteVerify] = React.useState(false);
    const [changeOvers, setChangeOvers] = React.useState(false);

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

    const items = [
        { ...allowedOption, text: 'Undo previous', icon: <Undo />, action: props.undoPreviousDelivery },
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
            action: () => props.batterUnavailable(UnavailableReason.Retired),
        },
        {
            ...allowedOption,
            text: 'Absent',
            icon: <ArrowRightAlt />,
            action: () => props.batterUnavailable(UnavailableReason.Absent),
        },
        { ...allowedOption, text: 'Complete over', icon: <Done />, action: completeOver },
        { ...allowedOption, text: 'Complete innings', icon: <Done />, action: () => setInningsCompleteVerify(true) },
        { ...allowedOption, text: 'Complete match', icon: <DoneAll />, action: () => setMatchCompleteVerify(true) },
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
            {overNotCompleteWarning &&
                <OverNotCompleteWarning yes={warningYes} no={warningNo} />}
            {inningsCompleteVerify &&
                <VerifyCompleteInnings complete={completeInnings} cancel={cancelCompleteInnings} />}
            {matchCompleteVerify &&
                <CompleteMatch
                    homeTeam={props.inProgressMatchStore.match.homeTeam.name}
                    awayTeam={props.inProgressMatchStore.match.awayTeam.name}
                    complete={completeMatch}
                    cancel={cancelCompleteMatch}
                    calculateResult={() => calculateResult(props.inProgressMatchStore.match)}
                    undoPrevious={props.undoPreviousDelivery}
                />}
            {changeOvers &&
                typeof props.inProgressMatchStore.currentInnings !== 'undefined' &&
                typeof props.inProgressMatchStore.currentInnings.maximumOvers !== 'undefined' &&
                <UpdateOvers
                    update={updateOvers}
                    cancel={cancelChangeOvers}
                    overs={props.inProgressMatchStore.currentInnings.maximumOvers}
                />}
        </>);
};
