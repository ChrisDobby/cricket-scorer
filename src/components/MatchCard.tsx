import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

type Match = {
    id: string;
    date: string;
    status: string;
    homeTeam: string;
    awayTeam: string;
};

interface MatchCardProps {
    match: Match;
    showScorecard: () => void;
}

const dividerStyle: React.CSSProperties = {
    marginTop: '8px',
    marginBottom: '8px',
};

export default (props: MatchCardProps) => (
    <Grid item xs={12} sm={6} md={4}>
        <Card style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
                <CardContent>
                    <Typography component="h2" variant="h5" color="primary" style={{ minHeight: '80px' }}>
                        {`${props.match.homeTeam} v ${props.match.awayTeam}`}
                    </Typography>
                    <Divider style={dividerStyle} />
                    <Typography component="h2" variant="h6">
                        {props.match.status}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary" onClick={props.showScorecard}>
                        Scorecard
                    </Button>
                </CardActions>
            </div>
        </Card>
    </Grid>);
