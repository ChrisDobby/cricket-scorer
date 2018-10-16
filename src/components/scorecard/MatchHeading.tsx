import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import * as styles from './styles';

interface MatchHeadingProps {
    homeTeam: string;
    awayTeam: string;
    date: string;
    matchStatus: string;
}

export default ({ homeTeam, awayTeam, date, matchStatus }: MatchHeadingProps) => (
    <div style={styles.textCentre}>
        <Typography variant="h6">{date}</Typography>
        <Typography variant="h5">{`${homeTeam} v ${awayTeam}`}</Typography>
        <Typography variant="h6">{matchStatus}</Typography>
    </div>);
