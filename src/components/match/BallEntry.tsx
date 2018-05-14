import * as React from 'react';
import * as globalStyles from '../styles';
import { Innings, Batter, Bowler, oversDescription, BattingInnings } from '../../domain';
import { EntryPanel, BallFunctions } from './EntryPanel';

const battingScoreStyle: React.CSSProperties = {
    display: 'inline',
    marginRight: '10px',
};

export interface BallEntryProps {
    innings: Innings;
    batter: Batter;
    bowler: Bowler;
    ballFunctions: BallFunctions;
}

export const BallEntry = ({ innings, batter, bowler, ballFunctions }: BallEntryProps) => (
    <div style={globalStyles.sectionContainer}>
        <div className="row" style={globalStyles.singleHeadingRow}>
            <h4>{`${bowler.name} to ${batter.name}`}</h4>
        </div>
        <div className="row">
            <div className="col-12 col-lg-6">
                <div className="row">
                    <div className="col-6">
                        <h5>{innings.battingTeam.name}</h5>
                    </div>
                    <div className="col-6">
                        <h5>{`${innings.score}-${innings.wickets}`}</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <h5>Overs</h5>
                    </div>
                    <div className="col-6">
                        <h5>{oversDescription(innings.completedOvers, [])}</h5>
                    </div>
                </div>
                {innings.batting.batters.filter(batter => batter.innings && !batter.innings.wicket)
                    .map((batter, idx) => ({
                        name: batter.name,
                        innings: batter.innings as BattingInnings,
                        index: idx,
                    }))
                    .map(currentBatter => (
                        <div key={currentBatter.index} className="row">
                            <div className="col-6">
                                <h5>{currentBatter.name}</h5>
                            </div>
                            <div className="col-6">
                                <span>
                                    <h5 style={battingScoreStyle}>{`${currentBatter.innings.runs}` +
                                        `(${currentBatter.innings.ballsFaced})`}</h5>
                                    {currentBatter.name === batter.name && <i className="fa fa-circle" />}
                                </span>
                            </div>
                        </div>
                    ))}
                <div className="row">
                    <div className="col-6">
                        <h5>{bowler.name}</h5>
                    </div>
                    <div className="col-6">
                        <h5>
                            {`${oversDescription(bowler.completedOvers, [])}-` +
                                `${bowler.maidenOvers}-${bowler.runs}-${bowler.wickets}`}
                        </h5>
                    </div>
                </div>
            </div>
            <div className="col-12 col-lg-6">
                <EntryPanel ballFunctions={ballFunctions} />
            </div>
        </div>
    </div>
);
