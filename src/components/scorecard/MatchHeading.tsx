import * as React from 'react';
import * as styles from './styles';
import * as globalStyles from '../styles';

const matchHeadingRow: React.CSSProperties = {
    ...globalStyles.headingRow,
    ...styles.textCentre,
};

export interface MatchHeadingProps {
    homeTeam: string;
    awayTeam: string;
    date: string;
    matchStatus: string;
}

export const MatchHeading = ({ homeTeam, awayTeam, date, matchStatus }: MatchHeadingProps) => (
    <div className="col-12">
        <div className="row" style={matchHeadingRow}>
            <div className="col-12">
                <h5>{date}</h5>
            </div>
            <div className="col-12">
                <h4>{`${homeTeam} v ${awayTeam}`}</h4>
            </div>
            <div className="col-12">
                <h6>{matchStatus}</h6>
            </div>
        </div>
    </div>
);
