import * as React from 'react';
import { Extras } from './Extras';
import { Batting as InningsBatting, BattingInnings, howOutDescription } from '../../domain';
import * as styles from './styles';

const battingContainer: React.CSSProperties = {
    width: '100%',
    padding: '20px',
    marginBottom: '20px',
};

const howOut = (innings?: BattingInnings): string => {
    if (!innings) { return ''; }

    return howOutDescription(innings.wicket);
};

interface InningsItemProps { innings?: BattingInnings; }
const Howout = (props: InningsItemProps) => (
    <div className="col-md-4">{howOut(props.innings)}</div>
);

interface CellItemProps {
    property: string;
    style: React.CSSProperties;
}
const CellItem = ({ property, style }: CellItemProps) => (
    <div className="col-md-1" style={style}>{property}</div>
);

export interface BattingProps { batting: InningsBatting; }

export const Batting = ({ batting }: BattingProps) => (
    <div className="col-xl-8 col-lg-12">
        <div style={battingContainer}>
            <div className="row" style={styles.headingRow}>
                <div className="col-md-7"><h6>Batsman</h6></div>
                <div className="col-md-1" style={styles.numberCell}><h6>Runs</h6></div>
                <div className="col-md-1" style={styles.numberCell}><h6>Balls</h6></div>
                <div className="col-md-1" style={styles.numberCell}><h6>Mins</h6></div>
                <div className="col-md-1" style={styles.numberCell}><h6>4s</h6></div>
                <div className="col-md-1" style={styles.numberCell}><h6>6s</h6></div>
            </div>    
            {batting.batters.map(batter =>
                <div className="row" style={styles.itemRow} key={batter.position}>
                    <div className="col-md-3">{batter.name}</div>
                    <Howout innings={batter.innings} />
                    <CellItem property={batter.innings ? batter.innings.runs.toString() : ''} style={styles.runsCell} />
                    <CellItem
                        property={batter.innings ? batter.innings.ballsFaced.toString() : ''}
                        style={styles.numberCell}
                    />
                    <CellItem property={batter.innings ? '0' : ''} style={styles.numberCell} />
                    <CellItem
                        property={batter.innings ? batter.innings.fours.toString() : ''}
                        style={styles.numberCell}
                    />
                    <CellItem
                        property={batter.innings ? batter.innings.sixes.toString() : ''}
                        style={styles.numberCell}
                    />
                </div>)}
            <Extras extras={batting.extras} />
        </div>
    </div>
);
