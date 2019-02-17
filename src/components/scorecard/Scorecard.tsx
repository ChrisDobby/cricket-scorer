import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import { Match as MatchEntity } from '../../domain';
import MatchHeading from './MatchHeading';
import { Button } from '@material-ui/core';
import { textCentre } from './styles';
import Tooltip from '../Tooltip';
import InningsTabs from './InningsTabs';
import TeamSheets from './TeamSheets';

const styles = (theme: any) => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: '20px',
    },
});

interface ScorecardProps {
    cricketMatch: MatchEntity;
    lastEvent: string | undefined;
    classes: any;
    canContinue: boolean;
    continue: () => void;
}

export default withStyles(styles)((props: ScorecardProps) => {
    return (
        <Paper className={props.classes.root} elevation={1}>
            <MatchHeading
                homeTeam={props.cricketMatch.homeTeam.name}
                awayTeam={props.cricketMatch.awayTeam.name}
                date={props.cricketMatch.date}
                matchStatus={props.cricketMatch.status}
                lastEvent={props.lastEvent}
            />
            {props.canContinue && (
                <div style={textCentre}>
                    <Tooltip title="Continue scoring this match">
                        <Button color="secondary" onClick={props.continue}>
                            Continue scoring
                        </Button>
                    </Tooltip>
                </div>
            )}
            <Divider />
            {props.cricketMatch.innings.length > 0 && <InningsTabs match={props.cricketMatch} />}
            {props.cricketMatch.innings.length === 0 && <TeamSheets match={props.cricketMatch} />}
        </Paper>
    );
});
