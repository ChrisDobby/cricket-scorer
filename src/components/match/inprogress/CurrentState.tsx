import * as React from 'react';
import Hidden from '@material-ui/core/Hidden';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Innings, Batter, Bowler, Over, Team } from '../../../domain';
import CurrentOver from './CurrentOver';
import InningsState from './InningsState';

interface CurrentStateProps {
    battingTeam: Team;
    bowlingTeam: Team;
    innings: Innings;
    batter: Batter;
    bowler: Bowler;
    currentOver: Over;
}

export default ({ battingTeam, bowlingTeam, innings, batter, bowler, currentOver }: CurrentStateProps) => (
    <>
        <Hidden xsDown>
            <InningsState
                battingTeam={battingTeam.name}
                battingPlayers={battingTeam.players}
                bowlingPlayers={bowlingTeam.players}
                innings={innings}
                batter={batter}
                bowler={bowler}
            />
        </Hidden>
        <Hidden smUp>
            <ExpansionPanel style={{ width: '100%' }}>
                <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                    <Typography>{`${battingTeam.name} ${innings.score}-${innings.wickets}`}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container>
                        <InningsState
                            battingTeam={battingTeam.name}
                            battingPlayers={battingTeam.players}
                            bowlingPlayers={bowlingTeam.players}
                            innings={innings}
                            batter={batter}
                            bowler={bowler}
                        />
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </Hidden>
        <CurrentOver over={currentOver} />
    </>
);
