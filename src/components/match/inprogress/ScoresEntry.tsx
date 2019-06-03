import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import { DeliveryOutcome, DeliveryScores } from '../../../domain';
import executeDeliveryAction from './executeDeliveryAction';
import Tooltip from '../../Tooltip';
import { ScoreType } from './ScoreTypeSelect';
import HelpTooltip from '../../HelpTooltip';
import HelpContent from '../../HelpContent';

const buttonStyle = (deliveryOutcome: DeliveryOutcome): React.CSSProperties => ({
    backgroundColor: deliveryOutcome === DeliveryOutcome.Valid ? green[600] : red[700],
    marginRight: '8px',
    marginBottom: '8px',
    color: '#ffffff',
});

const boundary = (score: number) => (
    <span style={{ fontSize: '70%' }}>
        boundary
        <br />
        <span style={{ fontSize: '200%' }}>{score}</span>
    </span>
);

interface ScoresEntryProps {
    deliveryOutcome: DeliveryOutcome;
    scoreType: ScoreType;
    hasBoundaries: boolean;
    getScores: (score: number) => DeliveryScores;
    action: (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => void;
}

const executeNonStandard = (score: number, execute: (score: number) => () => void) => {
    if (score >= 4) {
        execute(score)();
    }
};

const dotDescription = (deliveryOutcome: DeliveryOutcome) => {
    if (deliveryOutcome === DeliveryOutcome.Wide) {
        return 'Record a wide with no extra runs';
    }

    if (deliveryOutcome === DeliveryOutcome.Noball) {
        return 'Record a no ball with no extra runs';
    }

    return 'Record a dot ball';
};

const runsDescription = (deliveryOutcome: DeliveryOutcome, scoreType: ScoreType) => (
    runs: number,
    isBoundary?: boolean,
) => {
    const scoreDescription = () => {
        switch (scoreType) {
            case ScoreType.Runs:
                return `${runs === 1 ? '1 run' : `${runs} runs`}`;
            case ScoreType.Byes:
                return `${runs === 1 ? '1 bye' : `${runs} byes`}`;
            case ScoreType.LegByes:
                return `${runs === 1 ? '1 leg bye' : `${runs} leg byes`}`;
            default:
                return '';
        }
    };

    const addBoundary = (text: string) => (isBoundary ? `${text} (boundary)` : text);

    if (deliveryOutcome === DeliveryOutcome.Wide) {
        return addBoundary(`Record a wide with ${runs === 1 ? 'an extra run' : `${runs} extra runs`}`);
    }

    if (deliveryOutcome === DeliveryOutcome.Noball) {
        return addBoundary(`Record a no ball with ${scoreDescription()}`);
    }

    return addBoundary(scoreDescription());
};

export default ({ deliveryOutcome, scoreType, hasBoundaries, getScores, action }: ScoresEntryProps) => {
    const execute = executeDeliveryAction(action, getScores, deliveryOutcome);
    const executeBoundary = executeDeliveryAction(
        action,
        deliveryOutcome === DeliveryOutcome.Wide || scoreType !== ScoreType.Runs
            ? getScores
            : score => ({ boundaries: score }),
        deliveryOutcome,
    );

    const executeDot = executeDeliveryAction(action, () => ({ runs: 0 }), deliveryOutcome);
    const style = buttonStyle(deliveryOutcome);

    const runsTitle = runsDescription(deliveryOutcome, scoreType);
    return (
        <Grid container>
            <Grid container>
                <Tooltip title={dotDescription(deliveryOutcome)}>
                    <Button variant="fab" aria-label="Dot ball" style={style} onClick={executeDot(0)}>
                        {'.'}
                    </Button>
                </Tooltip>
                <Tooltip title={runsTitle(1)}>
                    <Button variant="fab" aria-label="Single" style={style} onClick={execute(1)}>
                        {'1'}
                    </Button>
                </Tooltip>
                <Tooltip title={runsTitle(2)}>
                    <Button variant="fab" aria-label="Two" style={style} onClick={execute(2)}>
                        {'2'}
                    </Button>
                </Tooltip>
                <Tooltip title={runsTitle(3)}>
                    <Button variant="fab" aria-label="Three" style={style} onClick={execute(3)}>
                        {'3'}
                    </Button>
                </Tooltip>
                <Tooltip title={runsTitle(4, true)}>
                    <Button variant="extendedFab" aria-label="Boundary Four" style={style} onClick={executeBoundary(4)}>
                        {boundary(4)}
                    </Button>
                </Tooltip>
                {hasBoundaries && (
                    <Tooltip title={runsTitle(6, true)}>
                        <Button
                            variant="extendedFab"
                            aria-label="Boundary Six"
                            style={style}
                            onClick={executeBoundary(6)}
                        >
                            {boundary(6)}
                        </Button>
                    </Tooltip>
                )}
            </Grid>
            <Grid container>
                <HelpTooltip title={<HelpContent.RunsScored />}>
                    <Select value={0} onChange={ev => executeNonStandard(Number(ev.target.value), execute)}>
                        <MenuItem value={0}>or select a score...</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={7}>7</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={9}>9</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                    </Select>
                </HelpTooltip>
            </Grid>
        </Grid>
    );
};
