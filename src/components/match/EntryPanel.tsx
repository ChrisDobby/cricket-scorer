import * as React from 'react';

const buttonStyle: React.CSSProperties = {
    width: '36px',
};

export interface BallFunctions {
    dotBall: () => void;
    completeOver: () => void;
}

export interface EntryPanelProps {
    ballFunctions: BallFunctions;
}

export const EntryPanel = ({ ballFunctions }: EntryPanelProps) => (
    <div>
        <button className="btn btn-primary" style={buttonStyle} onClick={ballFunctions.dotBall}>.</button>
    </div>
);
