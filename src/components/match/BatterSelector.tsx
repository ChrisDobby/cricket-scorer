import * as React from 'react';

export interface PlayerPosition {
    position: number;
    playerIndex: number;
}

export interface BatterSelectorProps {
    players: string[];
    playerPositions: PlayerPosition[];
    availablePositions: number[];
    playerSelected: (index: number, position: number) => void;
    playerRemoved: (position: number) => void;
}

const indicatorStyle: React.CSSProperties = {
    float: 'left',
    width: '30px',
    textAlign: 'center',
};

const selectablePlayerStyle: React.CSSProperties = {
    cursor: 'pointer',
};

interface PositionIndicatorProps {
    playerIndex: number;
    playerPositions: PlayerPosition[];
}

const PositionIndicator = ({ playerIndex, playerPositions }: PositionIndicatorProps) => {
    const [playerWithPosition] = playerPositions.filter(pp => pp.playerIndex === playerIndex);
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
    const [playerPosition] = playerPositions.filter(playerPos => playerPos.playerIndex === index);
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
    players, playerPositions, availablePositions, playerSelected, playerRemoved,
}: BatterSelectorProps) => (
        <div>
            {players.map((player, index) =>
                (
                    <div
                        key={player}
                        className="row"
                        style={selectablePlayerStyle}
                        onClick={() => positionSelected(
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
