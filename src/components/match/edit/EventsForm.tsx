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

interface EventsFormState {
    events: Event[];
    rollbackToInnings: Innings | undefined;
    rollbackToIndex: number | undefined;
}

export default class extends React.PureComponent<EventsFormProps> {
    state: EventsFormState = {
        events: this.props.innings.events,
        rollbackToInnings: undefined,
        rollbackToIndex: undefined,
    };

    createDeliveryEvent = (delivery: Delivery, index: number) => {
        return {
            ...delivery,
            index,
            batter: this.props.battingPlayers[this.props.innings.batting.batters[delivery.batsmanIndex].playerIndex],
            bowler: this.props.bowlingPlayers[this.props.innings.bowlers[delivery.bowlerIndex].playerIndex],
        };
    }

    addDelivery = (delivery: Delivery, index: number, obj: any) => {
        if (!Object.keys(obj).find(key => key === delivery.overNumber.toString())) {
            return {
                ...obj,
                [delivery.overNumber.toString()]: {
                    bowler: this.props.bowlingPlayers[this.props.innings.bowlers[delivery.bowlerIndex].playerIndex],
                    events: [this.createDeliveryEvent(delivery, index)],
                },
            };
        }

        return {
            ...obj,
            [delivery.overNumber.toString()]: {
                ...obj[delivery.overNumber.toString()],
                events: [...obj[delivery.overNumber.toString()].events, this.createDeliveryEvent(delivery, index)],
            },
        };
    }

    addNonDelivery = (event: Event, index: number, obj: any) => {
        const lastKey = Object.keys(obj)[Object.keys(obj).length - 1];
        return {
            ...obj,
            [lastKey]: {
                ...obj[lastKey],
                events: [...obj[lastKey].events, { ...event, index }],
            },
        };
    }

    confirmRollback = (index: number) =>
        this.setState({ rollbackToInnings: this.props.rolledBackInnings(index), rollbackToIndex: index })

    cancelRollback = () => this.setState({ rollbackToInnings: undefined, rollbackToIndex: undefined });

    doRollback = () => {
        if (this.state.rollbackToIndex) {
            this.props.rollback(this.state.rollbackToIndex);
        }

        this.setState({ rollbackToInnings: undefined, rollbackToIndex: undefined });
    }

    get overs() {
        return this.state.events.reduce(
            (overs, event, idx) => {
                if (event.type === EventType.Delivery) {
                    return this.addDelivery(event as Delivery, idx, overs);
                }

                return this.addNonDelivery(event, idx, overs);
            },
            {});
    }

    render() {
        const overs = this.overs;

        return (
            <React.Fragment>
                <EditForm
                    heading="Edit innings"
                    save={() => { }}
                    canSave={() => true}
                >
                    <Grid container spacing={8}>
                        {Object.keys(overs).map(key => (
                            <Over
                                key={key}
                                overNumber={Number(key)}
                                detail={overs[key]}
                                config={this.props.config}
                                rollback={this.confirmRollback}
                            />
                        ))}
                    </Grid>
                </EditForm>
                {this.state.rollbackToInnings &&
                    <RollbackWarning
                        yes={this.doRollback}
                        no={this.cancelRollback}
                        rebuiltInnings={this.state.rollbackToInnings as Innings}
                    />}
            </React.Fragment>);
    }
}
