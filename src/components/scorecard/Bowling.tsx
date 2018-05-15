import * as React from 'react';
import { Bowler } from '../../domain';
import * as styles from './styles';
import * as globalStyles from '../styles';

export interface BowlingProps {
    team: string;
    bowlers: Bowler[];
}

export const Bowling = ({ team, bowlers }: BowlingProps) => (
    <div className="col-xl-8 col-lg-12">
        <div style={globalStyles.sectionContainer}>
            <div className="row">
                <h6>{team} bowling</h6>
            </div>
            <div className="row" style={globalStyles.headingRow}>
                <div className="col-6 col-md-5" />
                <div className="col-2" style={styles.centreCell}><h6>Overs</h6></div>
                <div className="col-2 d-none d-md-block" style={styles.centreCell}><h6>Maidens</h6></div>
                <div className="col-2" style={styles.centreCell}><h6>Runs</h6></div>
                <div className="col-2 col-md-1" style={styles.centreCell}><h6>Wkts</h6></div>
            </div>
            {bowlers.map((bowler, idx) => (
                <div key={idx} className="row">
                    <div className="col-6 col-md-5">{bowler.name}</div>
                    <div className="col-2" style={styles.centreCell}>{bowler.totalOvers}</div>
                    <div className="col-2 d-none d-md-block" style={styles.centreCell}>{bowler.maidenOvers}</div>
                    <div className="col-2" style={styles.centreCell}>{bowler.runs}</div>
                    <div className="col-2 col-md-1" style={styles.centreCell}>{bowler.wickets}</div>
                </div>
            ))}
        </div>
    </div>
);
