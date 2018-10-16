import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Batter, Bowler } from '../../domain';
import * as globalStyles from '../styles';

const headerTextStyle: React.CSSProperties = {
    marginLeft: '20px',
};

interface DeliveryHeaderProps {
    batter: Batter;
    bowler: Bowler;
    classes: any;
}

const DeliveryHeader = ({ batter, bowler, classes }: DeliveryHeaderProps) => (
    <Grid container className={classes.header}>
        <Typography
            style={headerTextStyle}
            color="inherit"
            variant="h5"
        >{`${bowler.name} to ${batter.name}`}
        </Typography>
    </Grid>);

export default withStyles(globalStyles.themedStyles)(DeliveryHeader);
