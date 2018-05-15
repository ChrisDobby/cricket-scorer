import * as React from 'react';
import * as styles from './styles';
import * as globalStyles from '../styles';

const totalLineStyle: React.CSSProperties = {
    ...globalStyles.headingRow,
    fontSize: '14px',
    paddingBottom: '4px',
};

export interface TotalLineProps {
    score: number;
    wickets: number;
    totalOvers: string;
}

export const TotalLine = ({ score, wickets, totalOvers }: TotalLineProps) => (
    <div className="row" style={totalLineStyle}>
        <div className="col-4 col-md-3">Total</div>
        <div className="col-6 col-md-4">
            {`(${wickets} wickets) (${totalOvers} overs)`}
        </div>
        <div className="col-2 col-md-1" style={styles.runsCell}>{score}</div>
    </div>
);
