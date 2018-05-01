import * as React from 'react';
import { Bowler, oversDescription } from '../../domain';
import * as styles from './styles';

export interface BowlingProps {
    team: string;
    bowlers: Bowler[];
}

export const Bowling = ({ team, bowlers }: BowlingProps) => (
    <div className="col-xl-8 col-lg-12">
        <div style={styles.sectionContainer}>
            <div className="row">
                <h6>{team} bowling</h6>
            </div>
            <div className="row" style={styles.headingRow}>
                <div className="col-6 col-md-5" />
                <div className="col-2" style={styles.centreCell}><h6>overs</h6></div>
                <div className="col-2 d-none d-md-block" style={styles.centreCell}><h6>maidens</h6></div>
                <div className="col-2" style={styles.centreCell}><h6>runs</h6></div>
                <div className="col-2 col-md-1" style={styles.centreCell}><h6>wkts</h6></div>
            </div>
            {bowlers.map(bowler => (
                <div className="row">
                    <div className="col-6 col-md-5">{bowler.name}</div>
                    <div className="col-2" style={styles.centreCell}>{oversDescription(bowler.balls)}</div>
                    <div className="col-2 d-none d-md-block" style={styles.centreCell}>{bowler.maidenOvers}</div>
                    <div className="col-2" style={styles.centreCell}>{bowler.runs}</div>
                    <div className="col-2 col-md-1" style={styles.centreCell}>{bowler.wickets}</div>
                </div>
            ))}
        </div>
    </div>
);
