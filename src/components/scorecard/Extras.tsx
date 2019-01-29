import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Extras as InningsExtras } from '../../domain';
import * as styles from './styles';
import TextUpdateNotify from '../TextUpdateNotify';

const extrasLine = ({ noBalls, wides, byes, legByes }: InningsExtras) =>
    `${noBalls}nb ${wides}wd ${byes}b ${legByes}lb`;

interface ExtrasProps {
    extras: InningsExtras;
}

export default ({ extras }: ExtrasProps) => (
    <Grid container>
        <Grid item xs={4} md={3}>
            <Typography variant="body1">Extras</Typography>
        </Grid>
        <Grid item xs={6} md={4}>
            <Typography variant="body2">
                <TextUpdateNotify text={extrasLine(extras)} />
            </Typography>
        </Grid>
        <Grid item xs={2} md={1}>
            <Typography style={styles.runsCell} variant="body1">
                <TextUpdateNotify text={`${extras.byes + extras.legByes + extras.wides + extras.noBalls}`} />
            </Typography>
        </Grid>
    </Grid>
);
