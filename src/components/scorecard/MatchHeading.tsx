import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import * as dateformat from 'dateformat';
import * as styles from './styles';

interface MatchHeadingProps {
    homeTeam: string;
    awayTeam: string;
    date: string;
    matchStatus: string;
    lastEvent: string | undefined;
}

export default ({ homeTeam, awayTeam, date, matchStatus, lastEvent }: MatchHeadingProps) => (
    <div style={styles.textCentre}>
        <Typography variant="h6">{dateformat(date, 'dd-mmm-yyyy')}</Typography>
        <Typography variant="h5">{`${homeTeam} v ${awayTeam}`}</Typography>
        <Typography variant="h6">{matchStatus}</Typography>
        <Typography variant="body1" color="textSecondary">{lastEvent}</Typography>
    </div>);
