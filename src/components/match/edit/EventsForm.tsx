import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import EditForm from '../EditForm';
import Over from './Over';
import RollbackWarning from './RollbackWarning';
import { Innings, EventType, Delivery, Event, MatchConfig } from '../../../domain';

interface EventsFormProps {
    config: MatchConfig;
    innings: Innings;
    battingPlayers: string[];
    bowlingPlayers: string[];
    rolledBackInnings: (index: number) => Innings | undefined;
    rollback: (index: number) => void;
}

export default (props: EventsFormProps) => {
    const [rollbackToInnings, setRollbackToInnings] = React.useState(undefined as Innings | undefined);
    const [rollbackToIndex, setRollbackToIndex] = React.useState(undefined as number | undefined);

    const createDeliveryEvent = (delivery: Delivery, index: number) => {
        return {
            ...delivery,
            index,
            batter: props.battingPlayers[props.innings.batting.batters[delivery.batsmanIndex].playerIndex],
            bowler: props.bowlingPlayers[props.innings.bowlers[delivery.bowlerIndex].playerIndex],
        };
    };

    const addDelivery = (delivery: Delivery, index: number, obj: any) => {
        if (!Object.keys(obj).find(key => key === delivery.overNumber.toString())) {
            return {
                ...obj,
                [delivery.overNumber.toString()]: {
                    bowler: props.bowlingPlayers[props.innings.bowlers[delivery.bowlerIndex].playerIndex],
                    events: [createDeliveryEvent(delivery, index)],
                },
            };
        }

        return {
            ...obj,
            [delivery.overNumber.toString()]: {
                ...obj[delivery.overNumber.toString()],
                events: [...obj[delivery.overNumber.toString()].events, createDeliveryEvent(delivery, index)],
            },
        };
    };

    const addNonDelivery = (event: Event, index: number, obj: any) => {
        const lastKey = Object.keys(obj)[Object.keys(obj).length - 1];
        return {
            ...obj,
            [lastKey]: {
                ...obj[lastKey],
                events: [...obj[lastKey].events, { ...event, index }],
            },
        };
    };

    const confirmRollback = (index: number) => {
        setRollbackToInnings(props.rolledBackInnings(index));
        setRollbackToIndex(index);
    };

    const cancelRollback = () => {
        setRollbackToInnings(undefined);
        setRollbackToIndex(undefined);
    };

    const doRollback = () => {
        if (rollbackToIndex) {
            props.rollback(rollbackToIndex);
        }

        setRollbackToInnings(undefined);
        setRollbackToIndex(undefined);
    };

    const getOvers = () =>
        props.innings.events.reduce((overs, event, idx) => {
            if (event.type === EventType.Delivery) {
                return addDelivery(event as Delivery, idx, overs);
            }

            return addNonDelivery(event, idx, overs);
        }, {});

    const overs = getOvers();
    return (
        <>
            <EditForm heading="Edit innings" save={() => {}} canSave={() => true}>
                <Grid container spacing={8}>
                    {Object.keys(overs).map(key => (
                        <Over
                            key={key}
                            overNumber={Number(key)}
                            detail={overs[key]}
                            config={props.config}
                            rollback={confirmRollback}
                        />
                    ))}
                </Grid>
            </EditForm>
            {rollbackToInnings && (
                <RollbackWarning yes={doRollback} no={cancelRollback} rebuiltInnings={rollbackToInnings as Innings} />
            )}
        </>
    );
};
