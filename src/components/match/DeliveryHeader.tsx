import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import * as globalStyles from '../styles';
import { Hidden } from '@material-ui/core';

const headerTextStyle: React.CSSProperties = {
    paddingLeft: '20px',
    width: '50%',
};

interface DeliveryHeaderProps {
    batter: string;
    bowler: string;
    battingPlayers: string[];
    classes: any;
}

const DeliveryHeader = ({ batter, bowler, classes }: DeliveryHeaderProps) => (
    <Grid container className={classes.header}>
        <Hidden xsDown>
            <Typography style={{ ...headerTextStyle, width: '50%' }} color="inherit" variant="h5">
                &nbsp;
            </Typography>
            <Typography style={headerTextStyle} color="inherit" variant="h5">
                {`${bowler} to ${batter}`}
            </Typography>
        </Hidden>
        <Hidden smUp>
            <Typography style={{ ...headerTextStyle, width: '100%' }} color="inherit" variant="h5">
                {`${bowler} to ${batter}`}
            </Typography>
        </Hidden>
    </Grid>
);

export default withStyles(globalStyles.themedStyles)(DeliveryHeader);
