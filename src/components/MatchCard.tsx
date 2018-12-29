import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import * as dateformat from 'dateformat';
import TextUpdateNotify from './TextUpdateNotify';
import { PersistedMatch, CurrentEditingMatch } from '../domain';

interface MatchCardProps {
    match: PersistedMatch | CurrentEditingMatch;
    currentUser: string | undefined;
    showScorecard: () => void;
    continueScoring: () => void;
    removeMatch: () => void;
}

const dividerStyle: React.CSSProperties = {
    marginTop: '8px',
    marginBottom: '8px',
};

export default (props: MatchCardProps) => (
    <Grid item xs={12} sm={6} md={4}>
        <Fade in={true} timeout={1000}>
            <Card style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <CardContent>
                        <Typography variant="subtitle1" color="textSecondary">
                            {dateformat(props.match.date, 'dd-mmm-yyyy')}
                        </Typography>
                        <Typography component="h2" variant="h5" color="primary" style={{ minHeight: '80px' }}>
                            {`${props.match.homeTeam} v ${props.match.awayTeam}`}
                        </Typography>
                        <Divider style={dividerStyle} />
                        <Typography component="h2" variant="h6" style={{ minHeight: '40px' }}>
                            <TextUpdateNotify text={props.match.status} />
                        </Typography>
                        <Typography component="h2" variant="body1" color="textSecondary" style={{ minHeight: '20px' }}>
                            <TextUpdateNotify text={props.match.lastEvent} />
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" onClick={props.showScorecard}>
                            Scorecard
                    </Button>
                        {props.match.user === props.currentUser &&
                            <>
                                <Button size="small" color="primary" onClick={props.continueScoring}>
                                    Continue
                            </Button>
                                <Button size="small" color="secondary" onClick={props.removeMatch}>
                                    Remove
                            </Button>
                            </>}
                    </CardActions>
                </div>
            </Card>
        </Fade>
    </Grid>);
