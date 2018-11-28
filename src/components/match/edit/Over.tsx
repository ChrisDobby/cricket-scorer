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

interface OverProps {
    config: domain.MatchConfig;
    overNumber: number;
    detail: any;
    rollback: (index: number) => void;
}

export default class extends React.PureComponent<OverProps> {
    state = {
        deliveries: this.props.detail.events.filter((e: domain.Event) => e.type === domain.EventType.Delivery)
            .map((e: domain.Event) => e as domain.Delivery),
        expanded: false,
    };

    toggleExpand = () => this.setState({ expanded: !this.state.expanded });

    render() {
        return (
            <>
                <Grid item xs={6} sm={4} md={3} lg={2}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Over {this.props.overNumber}</Typography>
                            <Typography variant="subtitle2" color="textSecondary">
                                {this.props.detail.bowler}
                            </Typography>
                            <Typography variant="body1">
                                {`${over.wickets(this.state.deliveries)} - ` +
                                    `${over.bowlingRuns(this.state.deliveries, this.props.config)}`}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="secondary" onClick={this.toggleExpand}>
                                {this.state.expanded ? 'Hide' : 'Show'}
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                {this.state.expanded &&
                    this.props.detail.events.map((e: any) => (
                        <Grid key={e.index} item xs={6} sm={4} md={3} lg={2}>
                            <EventCard event={e} rollback={() => this.props.rollback(e.index)} />
                        </Grid>
                    ))}
            </>);
    }
}
