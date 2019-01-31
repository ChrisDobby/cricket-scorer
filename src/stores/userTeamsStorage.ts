import { StoredMatch, Team } from '../domain';

const userTeamsStorage = (key: string) => (storage: any) => {
    const store = (storedMatch: StoredMatch) => {
        const item = storage.getItem(key);
        if (!item) {
            storage.setItem(key, JSON.stringify([storedMatch.match.homeTeam, storedMatch.match.awayTeam]));
        } else {
            const teams = JSON.parse(item);
            const updatedTeams = teams
                .filter(
                    (team: Team) =>
                        team.name !== storedMatch.match.homeTeam.name && team.name !== storedMatch.match.awayTeam.name,
                )
                .concat([storedMatch.match.homeTeam, storedMatch.match.awayTeam]);
            storage.setItem(key, JSON.stringify(updatedTeams));
        }
    };

    const read = () => {
        const item = storage.getItem(key);
        return {
            user: 'stored',
            teams: item ? JSON.parse(item) : [],
        };
    };

    return {
        store,
        read,
    };
};

export default userTeamsStorage('__user-teams__');
