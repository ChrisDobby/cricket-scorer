import * as React from 'react';
import { FallOfWicket } from '../../domain';
import * as styles from './styles';
import * as globalStyles from '../styles';

const fallOfWicketHeader: React.CSSProperties = {
    ...globalStyles.headingRow,
    paddingLeft: '8px',
};

export interface FallOfWicketsProps { fallOfWickets: FallOfWicket[]; }

export const FallOfWickets = ({ fallOfWickets }: FallOfWicketsProps) => (
    <div className="col-xl-4 col-lg-12">
        <div style={globalStyles.sectionContainer}>
            <div className="row" style={fallOfWicketHeader}>
                <h6>Fall of wickets</h6>
            </div>
            {fallOfWickets.map(fow => (
                <div key={fow.wicket} className="row" style={styles.itemRow}>
                    <div className="col-1">{fow.wicket}</div>
                    <div className="col-6">{fow.batter}</div>
                    <div className="col-2" style={styles.numberCell}>{fow.score}</div>
                    <div className="col-2" style={styles.numberCell}>{fow.partnership}</div>
                </div>
            ))}
        </div>
    </div>
);
