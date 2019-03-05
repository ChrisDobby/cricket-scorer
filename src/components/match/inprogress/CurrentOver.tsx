import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Over } from '../../../domain';
import DeliveryDisplay from './DeliveryDisplay';
import HelpTooltip from '../../HelpTooltip';
import HelpContent from '../../HelpContent';

interface CurrentOverProps {
    over: Over;
}

const overContainerStyle: React.CSSProperties = {
    minHeight: '100px',
    paddingTop: '10px',
    paddingBottom: '10px',
};

export default ({ over }: CurrentOverProps) => (
    <HelpTooltip title={<HelpContent.CurrentOver />}>
        <div style={overContainerStyle}>
            <Grid container>
                <Typography variant="h6">{`This over ${over.wickets} - ${over.bowlingRuns}`}</Typography>
            </Grid>
            <Grid container>
                {over.deliveries.map((delivery, index) => (
                    <DeliveryDisplay key={index} outcome={delivery.outcome} />
                ))}
            </Grid>
        </div>
    </HelpTooltip>
);
