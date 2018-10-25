import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Over } from '../../../domain';
import { DeliveryDisplay } from './DeliveryDisplay';

export interface CurrentOverProps { over: Over; }

export const CurrentOver = ({ over }: CurrentOverProps) => (
    <React.Fragment>
        <Grid container>
            <Typography variant="h6">{`This over ${over.wickets} - ${over.bowlingRuns}`}</Typography>
        </Grid>
        <Grid container>
            {over.deliveries.map((delivery, index) => <DeliveryDisplay key={index} outcome={delivery.outcome} />)}
        </Grid>
    </React.Fragment>);
