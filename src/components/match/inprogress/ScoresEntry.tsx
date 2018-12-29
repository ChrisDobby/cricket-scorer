import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import { DeliveryOutcome, DeliveryScores } from '../../../domain';
import executeDeliveryAction from './executeDeliveryAction';

const buttonStyle = (deliveryOutcome: DeliveryOutcome): React.CSSProperties => ({
    backgroundColor: deliveryOutcome === DeliveryOutcome.Valid ? green[600] : red[700],
    marginRight: '8px',
    marginBottom: '8px',
    color: '#ffffff',
});

const boundary = (score: number) => (
    <span style={{ fontSize: '70%' }}>boundary<br /><span style={{ fontSize: '200%' }}>{score}</span></span>
);

interface ScoresEntryProps {
    deliveryOutcome: DeliveryOutcome;
    hasBoundaries: boolean;
    getScores: (score: number) => DeliveryScores;
    action: (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => void;
}

const executeNonStandard = (score: number, execute: (score: number) => () => void) => {
    if (score >= 5) {
        execute(score)();
    }
};

export default ({ deliveryOutcome, hasBoundaries, getScores, action }: ScoresEntryProps) => {
    const execute = executeDeliveryAction(action, getScores, deliveryOutcome);
    const executeBoundary = executeDeliveryAction(action, score => ({ boundaries: score }), deliveryOutcome);
    const executeDot = executeDeliveryAction(action, () => ({ runs: 0 }), deliveryOutcome);
    const style = buttonStyle(deliveryOutcome);

    return (
        <Grid container>
            <Grid container>
                <Button
                    variant="fab"
                    aria-label="Dot ball"
                    style={style}
                    onClick={executeDot(0)}
                >{'.'}
                </Button>
                <Button
                    variant="fab"
                    aria-label="Single"
                    style={style}
                    onClick={execute(1)}
                >{'1'}
                </Button>
                <Button
                    variant="fab"
                    aria-label="Two"
                    style={style}
                    onClick={execute(2)}
                >{'2'}
                </Button>
                <Button
                    variant="fab"
                    aria-label="Three"
                    style={style}
                    onClick={execute(3)}
                >{'3'}
                </Button>
                <Button
                    variant="extendedFab"
                    aria-label="Boundary Four"
                    style={style}
                    onClick={executeBoundary(4)}
                >{boundary(4)}
                </Button>
                {hasBoundaries &&
                    <Button
                        variant="extendedFab"
                        aria-label="Boundary Six"
                        style={style}
                        onClick={executeBoundary(6)}
                    >{boundary(6)}
                    </Button>}
            </Grid>
            <Grid container>
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
            </Grid>
        </Grid>);
};
