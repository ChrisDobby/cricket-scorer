import * as React from 'react';
import EditForm from '../EditForm';
import TeamsEntry from '../TeamsEntry';
import { TeamType } from '../../../domain';

interface TeamsFormProps {
    homeTeam: string;
    awayTeam: string;
    homePlayers: string[];
    awayPlayers: string[];
    save: (homeTeam: string, awayTeam: string, homePlayers: string[], awayPlayers: string[]) => void;
}
export default (props: TeamsFormProps) => {
    const [homeTeam, setHomeTeam] = React.useState(props.homeTeam);
    const [awayTeam, setAwayTeam] = React.useState(props.awayTeam);
    const [homePlayers, setHomePlayers] = React.useState(props.homePlayers);
    const [awayPlayers, setAwayPlayers] = React.useState(props.awayPlayers);

    const valid = () => homeTeam.length > 0 && awayTeam.length > 0 && homePlayers.length > 0 && awayPlayers.length > 0;
    const save = () => {
        if (valid()) {
            props.save(homeTeam, awayTeam, homePlayers, awayPlayers);
        }
    };

    const teamChanged = (type: TeamType, name: string) => {
        const set = type === TeamType.HomeTeam ? setHomeTeam : setAwayTeam;
        set(name);
    };

    const setPlayers = (type: TeamType, players: string[]) => {
        const set = type === TeamType.HomeTeam ? setHomePlayers : setAwayPlayers;
        set(players);
    };

    const playerChanged = (type: TeamType, playerNumber: number, name: string) => {
        const set = type === TeamType.HomeTeam ? setHomePlayers : setAwayPlayers;
        const players = type === TeamType.HomeTeam ? homePlayers : awayPlayers;
        players[playerNumber] = name;
        set(players);
    };

    return (
        <EditForm heading="Change teams" save={save} canSave={valid}>
            <TeamsEntry
                homeTeam={homeTeam}
                awayTeam={awayTeam}
                homePlayers={homePlayers}
                awayPlayers={awayPlayers}
                teamChanged={teamChanged}
                playerChanged={playerChanged}
                setPlayers={setPlayers}
            />
        </EditForm>
    );
};
