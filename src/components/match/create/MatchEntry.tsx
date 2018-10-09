import * as React from 'react';
import { MatchType } from '../../../domain';

interface MatchEntryProps {
    matchType: MatchType;
    oversPerSide: number;
    inningsPerSide: number;
    playersPerSide: number;
    runsPerNoBall: number;
    runsPerWide: number;
    matchTypeSelected: (type: MatchType) => void;
    oversChanged: (overs: number) => void;
    inningsChanged: (innings: number) => void;
    playersChanged: (players: number) => void;
    noBallRunsChanged: (runs: number) => void;
    wideRunsChanged: (runs: number) => void;
}
export default (props: MatchEntryProps) => (
    <React.Fragment>
        <div className="form-row">
            <div className="form-group col-md-4">
                <label htmlFor="matchType">Match type</label>
                <select
                    id="matchType"
                    className="custom-select"
                    value={props.matchType}
                    onChange={ev => props.matchTypeSelected(Number(ev.target.value))}
                >
                    <option value={MatchType.LimitedOvers}>Limited overs</option>
                    <option value={MatchType.Time}>Time</option>
                </select>
            </div>
            <div className="form-group col-md-4">
                {props.matchType === MatchType.LimitedOvers &&
                    <React.Fragment>
                        <label htmlFor="numberOfOvers">Number of overs</label>
                        <input
                            id="numberOfOvers"
                            type="number"
                            className="form-control"
                            value={props.oversPerSide}
                            onChange={ev => props.oversChanged(Number(ev.target.value))}
                        />
                    </React.Fragment>}
                {props.matchType === MatchType.Time &&
                    <React.Fragment>
                        <label htmlFor="numberOfInnings">Number of innings per team</label>
                        <input
                            id="numberOfInnings"
                            type="number"
                            className="form-control"
                            value={props.inningsPerSide}
                            onChange={ev => props.inningsChanged(Number(ev.target.value))}
                        />
                    </React.Fragment>}
            </div>
            <div className="form-group col-md-4">
                <label htmlFor="numberOfPlayers">Number of players</label>
                <input
                    id="numberOfPlayers"
                    type="number"
                    className="form-control"
                    value={props.playersPerSide}
                    onChange={ev => props.playersChanged(Number(ev.target.value))}
                />
            </div>
        </div>
        <div className="form-row">
            <div className="form-group col-md-6">
                <label htmlFor="noBallRuns">Runs for no ball</label>
                <input
                    id="noBallRuns"
                    type="number"
                    className="form-control"
                    value={props.runsPerNoBall}
                    onChange={ev => props.noBallRunsChanged(Number(ev.target.value))}
                />
            </div>
            <div className="form-group col-md-6">
                <label htmlFor="wideRuns">Runs for a wide</label>
                <input
                    id="wideRuns"
                    type="number"
                    className="form-control"
                    value={props.runsPerWide}
                    onChange={ev => props.wideRunsChanged(Number(ev.target.value))}
                />
            </div>
        </div>
    </React.Fragment>);
