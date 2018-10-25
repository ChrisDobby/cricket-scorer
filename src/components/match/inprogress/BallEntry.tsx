import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Innings, Batter, Bowler, Over, Team, MatchResult, DeliveryOutcome, DeliveryScores } from '../../../domain';
import EntryPanel from './EntryPanel';
import DeliveryHeader from '../DeliveryHeader';
import CurrentState from './CurrentState';
import OverCompleteAlert from './OverCompleteAlert';

interface BallEntryProps {
    innings: Innings;
    battingTeam: Team;
    batter: Batter;
    bowler: Bowler;
    overComplete: boolean;
    currentOver: Over;
    delivery: (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => void;
    completeOver: () => void;    homeTeam: string;
    awayTeam: string;
    calculateResult: () => MatchResult | undefined;
}

export default (props: BallEntryProps) => (
    <Grid container>
        <DeliveryHeader batter={props.batter} bowler={props.bowler} />
        <Grid container>
            <Grid item xs={12} lg={6} container>
                <CurrentState
                    battingTeam={props.battingTeam.name}
                    innings={props.innings}
                    batter={props.batter}
                    bowler={props.bowler}
                    currentOver={props.currentOver}
                />
            </Grid>
            <Grid item xs={12} lg={6} container>
                <EntryPanel
                    delivery={props.delivery}
                    overComplete={props.overComplete}
                    homeTeam={props.homeTeam}
                    awayTeam={props.awayTeam}
                    calculateResult={props.calculateResult}
                />
            </Grid>
        </Grid>
        {props.overComplete && <OverCompleteAlert completeOver={props.completeOver} />}
    </Grid>);
