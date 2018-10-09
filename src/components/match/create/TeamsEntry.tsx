import * as React from 'react';

export enum TeamType {
    HomeTeam,
    AwayTeam,
}

interface TeamsEntryProps {
    homeTeam: string;
    awayTeam: string;
    homePlayers: string[];
    awayPlayers: string[];
    teamChanged: (team: TeamType, name: string) => void;
    playerChanged: (team: TeamType, playerNumber: number, name: string) => void;
}

export default ({ homeTeam, awayTeam, homePlayers, awayPlayers,  teamChanged, playerChanged }: TeamsEntryProps) => (
    <React.Fragment>
        <div className="form-row">
            <div className="form-group col-md-6">
                <label htmlFor="homeTeam">Home team name</label>
                <input
                    id="homeTeam"
                    type="text"
                    className="form-control"
                    value={homeTeam}
                    onChange={ev => teamChanged(TeamType.HomeTeam, ev.target.value)}
                />
            </div>
            <div className="form-group col-md-6">
                <label htmlFor="awayTeam">Away team name</label>
                <input
                    id="awayTeam"
                    type="text"
                    className="form-control"
                    value={awayTeam}
                    onChange={ev => teamChanged(TeamType.AwayTeam, ev.target.value)}
                />
            </div>
        </div>
        <h5>Players</h5>
        <div className="form-row">
            <div className="form-group col-md-6">
                {homePlayers.map((player, playerNumber) => (
                    <input
                        key={playerNumber}
                        type="text"
                        className="form-control"
                        value={player}
                        onChange={ev => playerChanged(TeamType.HomeTeam, playerNumber, ev.target.value)}
                    />))}
            </div>
            <div className="form-group col-md-6">
                {awayPlayers.map((player, playerNumber) => (
                    <input
                        key={playerNumber}
                        type="text"
                        className="form-control"
                        value={player}
                        onChange={ev => playerChanged(TeamType.AwayTeam, playerNumber, ev.target.value)}
                    />))}
            </div>
        </div>
    </React.Fragment>);
