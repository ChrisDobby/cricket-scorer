import * as React from 'react';

const buttonStyle: React.CSSProperties = {
    width: '36px',
};

const rowStyle: React.CSSProperties = {
    marginBottom: '4px',
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
        <div className="row" style={rowStyle}>
            <button className="btn btn-primary" style={buttonStyle} onClick={ballFunctions.dotBall}>.</button>
        </div>
        <div className="row" style={rowStyle}>
            <button className="btn btn-primary" style={buttonStyle} onClick={ballFunctions.completeOver}>
                <i className="fa fa-fast-forward" />
            </button>
        </div>
    </div>
);
