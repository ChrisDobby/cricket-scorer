import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import * as over from '../../../match/over';
import * as domain from '../../../domain';
import EventCard from './EventCard';
import { flexContainerStyle } from '../../styles';

interface OverProps {
    config: domain.MatchConfig;
    overNumber: number;
    detail: any;
    rollback: (index: number) => void;
}

export default (props: OverProps) => {
    const [expanded, setExpanded] = React.useState(false);

    const deliveries = props.detail.events
        .filter((e: domain.Event) => e.type === domain.EventType.Delivery)
        .map((e: domain.Event) => e as domain.Delivery);

    return (
        <>
            <Grid item xs={6} sm={4} md={3} lg={2}>
                <Card style={{ ...flexContainerStyle, height: '100%' }}>
                    <CardContent style={{ flex: 1 }}>
                        <Typography variant="h6">Over {props.overNumber}</Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            {props.detail.bowler}
                        </Typography>
                        <Typography variant="body1">
                            {`${over.wickets(deliveries)} - ` + `${over.bowlingRuns(deliveries, props.config)}`}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="secondary" onClick={() => setExpanded(!expanded)}>
                            {expanded ? 'Hide' : 'Show'}
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
            {expanded &&
                deliveries.map((e: any) => (
                    <Grid key={e.index} item xs={6} sm={4} md={3} lg={2}>
                        <EventCard event={e} rollback={() => props.rollback(e.index)} />
                    </Grid>
                ))}
        </>
    );
};
