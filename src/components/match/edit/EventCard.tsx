import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import * as dateformat from 'dateformat';
import { notificationDescription } from '../../../match/delivery';
import { Outcome } from '../../../domain';
import { flexContainerStyle } from '../../styles';

export interface CardEvent {
    time: number;
    batter: string;
    bowler: string;
    outcome: Outcome;
}

interface EventCardProps {
    event: CardEvent;
    rollback: () => void;
}

export default ({ event, rollback }: EventCardProps) => (
    <Card color="textSecondary" style={{ ...flexContainerStyle, height: '100%' }}>
        <CardContent color="primary" style={{ flex: 1 }}>
            <Typography variant="subtitle1">{dateformat(event.time, 'HH:MM')}</Typography>
            <Typography variant="body1">{`${event.bowler} to ${event.batter}`}</Typography>
            <Typography variant="body1" color="textSecondary">
                {notificationDescription(event.outcome)}
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small" color="secondary" onClick={rollback}>
                Roll innings back
            </Button>
        </CardActions>
    </Card>
);
