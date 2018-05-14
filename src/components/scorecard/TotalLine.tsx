import * as React from 'react';
import * as styles from './styles';
import * as globalStyles from '../styles';
import { oversDescription } from '../../domain';

const totalLineStyle: React.CSSProperties = {
    ...globalStyles.headingRow,
    fontSize: '14px',
    paddingBottom: '4px',
};

export interface TotalLineProps {
    score: number;
    wickets: number;
    completedOvers: number;
}

export const TotalLine = ({ score, wickets, completedOvers }: TotalLineProps) => (
    <div className="row" style={totalLineStyle}>
        <div className="col-4 col-md-3">Total</div>
        <div className="col-6 col-md-4">
            {`(${wickets} wickets) (${oversDescription(completedOvers, [])} overs)`}
        </div>
        <div className="col-2 col-md-1" style={styles.runsCell}>{score}</div>
    </div>
);
