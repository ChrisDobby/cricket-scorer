import * as React from 'react';
import * as styles from './styles';

export interface PlayerPosition {
    position: number;
    playerIndex: number;
}

export interface BatterSelectorProps {
    players: string[];
    playerPositions: PlayerPosition[];
    availablePositions: number[];
    notAllowedPlayers?: number[];
    playerSelected: (index: number, position: number) => void;
    playerRemoved: (position: number) => void;
}

const indicatorStyle: React.CSSProperties = {
    float: 'left',
    width: '30px',
    textAlign: 'center',
};

interface PositionIndicatorProps {
    playerIndex: number;
    playerPositions: PlayerPosition[];
}

const PositionIndicator = ({ playerIndex, playerPositions }: PositionIndicatorProps) => {
    const playerWithPosition = playerPositions.find(pp => pp.playerIndex === playerIndex);
    return (
        <div style={indicatorStyle}>
            {playerWithPosition &&
                <span className="badge badge-primary">{playerWithPosition.position}</span>}
        </div>
    );
};

const positionSelected = (
    index: number,
    availablePositions: number[],
    playerPositions: PlayerPosition[],
    playerSelected: (index: number, position: number) => void,
    playerRemoved: (position: number) => void): void => {
    if (availablePositions.length === 1) {
        playerSelected(index, availablePositions[0]);
        return;
    }

    const playerPosition = playerPositions.find(playerPos => playerPos.playerIndex === index);
    if (playerPosition) {
        playerRemoved(playerPosition.position);
        return;
    }

    const filledPositions = playerPositions.map(playerPos => playerPos.position);
    for (let i = 0; i < availablePositions.length; i += 1) {
        if (filledPositions.filter(pos => pos === availablePositions[i]).length === 0) {
            playerSelected(index, availablePositions[i]);
            break;
        }
    }
};

export const BatterSelector = ({
    players, playerPositions, availablePositions, notAllowedPlayers, playerSelected, playerRemoved,
}: BatterSelectorProps) => (
        <div>
            {players.map((player, index) =>
                (
                    <div
                        key={player}
                        className="row"
                        style={ notAllowedPlayers && notAllowedPlayers.find(idx => idx === index)
                            ? styles.nonSelectablePlayerStyle : styles.selectablePlayerStyle}
                        onClick={notAllowedPlayers && notAllowedPlayers.find(idx => idx === index)
                            ? () => { }
                            : () => positionSelected(
                                index,
                                availablePositions,
                                playerPositions,
                                playerSelected,
                                playerRemoved,
                            )}
                    >
                        <PositionIndicator playerIndex={index} playerPositions={playerPositions} />
                        <h6>{player}</h6>
                    </div>
                ))}
        </div>
    );
