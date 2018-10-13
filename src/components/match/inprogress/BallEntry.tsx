import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate } from '@fortawesome/free-solid-svg-icons';
import * as globalStyles from '../../styles';
import { Innings, Batter, Bowler, BattingInnings, Extras, Over, Team, MatchResult } from '../../../domain';
import { EntryPanel, BallFunctions } from './EntryPanel';
import { CurrentOver } from './CurrentOver';
import DeliveryHeader from '../DeliveryHeader';

const battingScoreStyle: React.CSSProperties = {
    display: 'inline',
    marginRight: '10px',
};

const overAlertStyle: React.CSSProperties = {
    textAlign: 'center',
};

const totalExtras = (extras: Extras): number =>
    extras.byes + extras.legByes + extras.noBalls + extras.wides + extras.penaltyRuns;

export interface BallEntryProps {
    innings: Innings;
    battingTeam: Team;
    batter: Batter;
    bowler: Bowler;
    overComplete: boolean;
    currentOver: Over;
    ballFunctions: BallFunctions;
    homeTeam: string;
    awayTeam: string;
    calculateResult: () => MatchResult | undefined;
}

export const BallEntry = ({
    innings, battingTeam, batter, bowler, overComplete, currentOver, ballFunctions, homeTeam, awayTeam, calculateResult,
}: BallEntryProps) => (
    <div style={globalStyles.sectionContainer}>
        <DeliveryHeader batter={batter} bowler={bowler} />
        <div className="row">
            <div className="col-12 col-lg-6 d-none d-md-block">
                <div className="row">
                    <div className="col-6">
                        <h5>{battingTeam.name}</h5>
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
                        <h5>{innings.totalOvers}</h5>
                    </div>
                </div>
                    {innings.batting.batters.filter(batter => batter.innings &&
                        !batter.innings.wicket &&
                        typeof batter.unavailableReason === 'undefined')
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
                                    {currentBatter.name === batter.name &&
                                        <FontAwesomeIcon style={globalStyles.primaryColour} icon={faCertificate} />}
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
                            {`${bowler.totalOvers}-` +
                                `${bowler.maidenOvers}-${bowler.runs}-${bowler.wickets}`}
                        </h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <h5>Extras</h5>
                    </div>
                    <div className="col-6">
                        <h5>{totalExtras(innings.batting.extras)}</h5>
                    </div>
                </div>
                {overComplete &&
                    <div className="row">
                    <div className="col-12" style={overAlertStyle}>
                            <div className="alert alert-danger" role="alert">
                                The current over should now be complete.
                            <div>
                                <button
                                    className="btn btn-danger"
                                    onClick={ballFunctions.completeOver}
                                >Complete it now
                                </button>
                                </div>
                            </div>
                        </div>
                    </div>}
                <CurrentOver over={currentOver} />
            </div>
            <div className="col-12 col-lg-6">
                    <EntryPanel
                        ballFunctions={ballFunctions}
                        overComplete={overComplete}
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                        calculateResult={calculateResult}
                    />
            </div>
        </div>
    </div>
);
