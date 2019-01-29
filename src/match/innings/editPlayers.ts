import { Match, Innings } from '../../domain';
import { getTeam } from '../utilities';

const editPlayers = () => {
    const changeBatting = (match: Match, innings: Innings, playerIndices: number[]) => {
        const newOrder = Array.from(new Set(playerIndices));
        if (innings.batting.batters.length !== newOrder.length) {
            return innings;
        }

        const battingTeam = getTeam(match, innings.battingTeam);
        return {
            ...innings,
            batting: {
                ...innings.batting,
                batters: innings.batting.batters.map((batter, idx) => ({
                    ...batter,
                    playerIndex: playerIndices[idx],
                    name: battingTeam.players[playerIndices[idx]],
                })),
            },
        };
    };

    const changeBowling = (match: Match, innings: Innings, playerIndices: number[]) => {
        const newOrder = Array.from(new Set(playerIndices));
        if (innings.bowlers.length !== newOrder.length) {
            return innings;
        }

        const bowlingTeam = getTeam(match, innings.bowlingTeam);
        return {
            ...innings,
            bowlers: innings.bowlers.map((bowler, idx) => ({
                ...bowler,
                playerIndex: playerIndices[idx],
                name: bowlingTeam.players[playerIndices[idx]],
            })),
        };
    };

    return {
        changeBatting,
        changeBowling,
    };
};

export default editPlayers();
