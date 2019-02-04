import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import * as globalStyles from '../styles';

const headerTextStyle: React.CSSProperties = {
    marginLeft: '20px',
};

interface DeliveryHeaderProps {
    batter: string;
    bowler: string;
    battingPlayers: string[];
    classes: any;
}

const DeliveryHeader = ({ batter, bowler, classes }: DeliveryHeaderProps) => (
    <Grid container className={classes.header}>
        <Typography style={headerTextStyle} color="inherit" variant="h5">
            {`${bowler} to ${batter}`}
        </Typography>
    </Grid>
);

export default withStyles(globalStyles.themedStyles)(DeliveryHeader);
