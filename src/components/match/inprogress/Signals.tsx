import * as React from 'react';
import { ScoreType } from './ScoreTypeSelect';
require('../../../../images/wide.png');
require('../../../../images/no-ball.png');
require('../../../../images/byes.png');
require('../../../../images/leg-byes.png');

interface SignalProps {
    scoreType: ScoreType;
    noBall: boolean;
}

const signalStyle: React.CSSProperties = {
    width: '51px',
    textAlign: 'center',
};

const imagePath = (scoreType: ScoreType, noBall: boolean) => {
    if (noBall) return '../no-ball.png';
    switch (scoreType) {
        case ScoreType.Byes:
            return '../byes.png';

        case ScoreType.LegByes:
            return '../leg-byes.png';

        case ScoreType.Wide:
            return '../wide.png';

        default:
            return '';
    }
};

export default (props: SignalProps) => {
    if (!props.noBall && props.scoreType === ScoreType.Runs) {
        return null;
    }

    return (
        <div style={signalStyle}>
            <img src={imagePath(props.scoreType, props.noBall)} />
        </div>
    );
};
