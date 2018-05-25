import * as React from 'react';
import { DeliveryOutcome } from '../../domain';

const buttonStyle: React.CSSProperties = {
    width: '36px',
};

const rowStyle: React.CSSProperties = {
    marginBottom: '4px',
};

export interface BallFunctions {
    delivery: (deliveryOutcome: DeliveryOutcome, score: number) => void;
    completeOver: () => void;
}

export interface EntryPanelProps {
    ballFunctions: BallFunctions;
}

const dotBall = (ballFunctions: BallFunctions) =>
    ballFunctions.delivery(DeliveryOutcome.Dot, 0);

const runs = (ballFunctions: BallFunctions, runs: number) =>
    ballFunctions.delivery(DeliveryOutcome.Runs, runs);

export const EntryPanel = ({ ballFunctions }: EntryPanelProps) => (
    <div>
        <div className="row" style={rowStyle}>
            <button className="btn btn-primary" style={buttonStyle} onClick={() => dotBall(ballFunctions)}>.</button>
            <button className="btn btn-primary" style={buttonStyle} onClick={() => runs(ballFunctions, 1)}>1</button>
            <button className="btn btn-primary" style={buttonStyle} onClick={() => runs(ballFunctions, 2)}>2</button>
            <button className="btn btn-primary" style={buttonStyle} onClick={() => runs(ballFunctions, 3)}>3</button>
        </div>
        <div className="row" style={rowStyle}>
            <button className="btn btn-primary" style={buttonStyle} onClick={ballFunctions.completeOver}>
                <i className="fa fa-fast-forward" />
            </button>
        </div>
    </div>
);
