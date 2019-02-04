import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Innings, Batter, Bowler, Over, Team, MatchResult, DeliveryOutcome, DeliveryScores } from '../../../domain';
import EntryPanel from './EntryPanel';
import DeliveryHeader from '../DeliveryHeader';
import CurrentState from './CurrentState';
import OverCompleteAlert from './OverCompleteAlert';
import EntryContainer from './EntryContainer';

interface BallEntryProps {
    innings: Innings;
    battingTeam: Team;
    bowlingTeam: Team;
    batter: Batter;
    bowler: Bowler;
    overComplete: boolean;
    currentOver: Over;
    delivery: (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => void;
    completeOver: () => void;
    homeTeam: string;
    awayTeam: string;
    calculateResult: () => MatchResult | undefined;
}

const entryContainerStyle: React.CSSProperties = {
    marginTop: '10px',
    marginBottom: '10px',
    padding: '5px',
};

export default (props: BallEntryProps) => (
    <Grid container>
        <DeliveryHeader
            batter={props.battingTeam.players[props.batter.playerIndex]}
            bowler={props.bowlingTeam.players[props.bowler.playerIndex]}
            battingPlayers={props.battingTeam.players}
        />
        <Grid container>
            <Grid item xs={12} lg={6} style={entryContainerStyle}>
                <EntryContainer>
                    <CurrentState
                        battingTeam={props.battingTeam}
                        bowlingTeam={props.bowlingTeam}
                        innings={props.innings}
                        batter={props.batter}
                        bowler={props.bowler}
                        currentOver={props.currentOver}
                    />
                </EntryContainer>
            </Grid>
            <Grid item xs={12} lg={6} style={entryContainerStyle}>
                <EntryContainer>
                    <EntryPanel
                        delivery={props.delivery}
                        overComplete={props.overComplete}
                        homeTeam={props.homeTeam}
                        awayTeam={props.awayTeam}
                        calculateResult={props.calculateResult}
                    />
                </EntryContainer>
            </Grid>
        </Grid>
        {props.overComplete && <OverCompleteAlert completeOver={props.completeOver} />}
    </Grid>
);
