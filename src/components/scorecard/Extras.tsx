import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Extras as InningsExtras } from '../../domain';
import * as styles from './styles';

const extrasLine = ({ noBalls, wides, byes, legByes }: InningsExtras) =>
    `${noBalls}nb ${wides}wd ${byes}b ${legByes}lb`;

interface ExtrasProps { extras: InningsExtras; }

export default ({ extras }: ExtrasProps) => (
    <Grid container>
        <Grid xs={4} md={3}>
            <Typography variant="body1">Extras</Typography>
        </Grid>
        <Grid xs={6} md={4}>
            <Typography variant="body2">{extrasLine(extras)}</Typography>
        </Grid>
        <Grid xs={2} md={1}>
            <Typography  style={styles.runsCell} variant="body1">
                {extras.byes + extras.legByes + extras.wides + extras.noBalls}
            </Typography>
        </Grid>
    </Grid>);
