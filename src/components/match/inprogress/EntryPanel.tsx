import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { DeliveryOutcome, DeliveryScores, MatchResult, Outcome } from '../../../domain';
import ScoresEntry from './ScoresEntry';
import { WarningModal, WarningType } from './WarningModal';
import DeliveryNotify from './DeliveryNotify';
import ScoreTypeSelect, { ScoreType } from './ScoreTypeSelect';
import Tooltip from '../../Tooltip';
import Signals from './Signals';
import HelpTooltip from '../../HelpTooltip';
import HelpContent from '../../HelpContent';

type EntryPanelProps = RouteComponentProps<{}> & {
    overComplete: boolean;
    delivery: (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => void;
    homeTeam: string;
    awayTeam: string;
    calculateResult: () => MatchResult | undefined;
};

export default withRouter((props: EntryPanelProps) => {
    const [noBall, setNoBall] = React.useState(false);
    const [scoreType, setScoreType] = React.useState(ScoreType.Runs);
    const [allRunFourWarning, setAllRunFourWarning] = React.useState(false);
    const [allRunSixWarning, setAllRunSixWarning] = React.useState(false);
    const [allRunDeliveryOutcome, setAllRunDeliveryOutcome] = React.useState(undefined as DeliveryOutcome | undefined);
    const [allRunScores, setAllRunScores] = React.useState(undefined as DeliveryScores | undefined);
    const [notifyOutcome, setNotifyOutcome] = React.useState(undefined as Outcome | undefined);

    const noBallPressed = () => {
        setNoBall(true);
        setScoreType(scoreType === ScoreType.Wide ? ScoreType.Runs : scoreType);
    };

    const legalBallPressed = () => setNoBall(false);
    const getHasBoundaries = () => scoreType === ScoreType.Runs;
    const getScore = (field: string) => (score: number) => ({
        [field]: score,
    });
    const getScoresFunc = () => {
        switch (scoreType) {
            case ScoreType.Byes:
                return getScore('byes');
            case ScoreType.LegByes:
                return getScore('legByes');
            case ScoreType.Wide:
                return getScore('wides');
            default:
                return getScore('runs');
        }
    };

    const getDeliveryOutcome = (): DeliveryOutcome => {
        if (noBall) {
            return DeliveryOutcome.Noball;
        }
        if (scoreType === ScoreType.Wide) {
            return DeliveryOutcome.Wide;
        }
        return DeliveryOutcome.Valid;
    };

    const notifyDelivery = (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) =>
        setNotifyOutcome({
            deliveryOutcome,
            scores,
        });

    const addDelivery = (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => {
        props.delivery(deliveryOutcome, scores);
        notifyDelivery(deliveryOutcome, scores);
        setNoBall(false);
        setScoreType(ScoreType.Runs);
    };

    const delivery = (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => {
        if (typeof scores.runs !== 'undefined' && (scores.runs === 4 || scores.runs === 6)) {
            setAllRunFourWarning(scores.runs === 4);
            setAllRunSixWarning(scores.runs === 6);
            setAllRunDeliveryOutcome(deliveryOutcome);
            setAllRunScores(scores);
            return;
        }

        addDelivery(deliveryOutcome, scores);
    };

    const clearWarnings = () => {
        setAllRunFourWarning(false);
        setAllRunSixWarning(false);
        setAllRunDeliveryOutcome(undefined);
        setAllRunScores(undefined);
    };

    const allRunWarningYes = () => {
        if (typeof allRunDeliveryOutcome !== 'undefined' && typeof allRunScores !== 'undefined') {
            addDelivery(allRunDeliveryOutcome, allRunScores);
        }

        clearWarnings();
    };

    return (
        <>
            <div style={{ width: '100%' }}>
                <Grid container>
                    <div style={{ flex: 1 }}>
                        <Tooltip title="Record a wicket">
                            <Button
                                style={{ marginRight: '10px', fontSize: '80%' }}
                                variant="fab"
                                aria-label="Wicket"
                                color="primary"
                                onClick={() => props.history.push('/match/wicket')}
                            >
                                {'wicket'}
                            </Button>
                        </Tooltip>
                        <HelpTooltip title={<HelpContent.WicketNoBall />}>
                            <span>
                                <Tooltip
                                    title={
                                        noBall
                                            ? 'Set the delivery to not be a no ball'
                                            : 'Set the delivery to be a no ball'
                                    }
                                >
                                    <FormControlLabel
                                        style={{ marginLeft: '8px' }}
                                        label="No ball"
                                        control={
                                            <Switch
                                                color="secondary"
                                                checked={noBall}
                                                onChange={ev =>
                                                    ev.target.checked ? noBallPressed() : legalBallPressed()
                                                }
                                            />
                                        }
                                    />
                                </Tooltip>
                            </span>
                        </HelpTooltip>
                    </div>
                    <Signals scoreType={scoreType} noBall={noBall} />
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                    </Grid>
                </Grid>
                <Grid container>
                    <HelpTooltip title={<HelpContent.ScoreType />}>
                        <div>
                            <ScoreTypeSelect selectedType={scoreType} noBall={noBall} scoreTypeChange={setScoreType} />
                        </div>
                    </HelpTooltip>
                </Grid>
                <Grid container>
                    <ScoresEntry
                        deliveryOutcome={getDeliveryOutcome()}
                        scoreType={scoreType}
                        getScores={getScoresFunc()}
                        action={delivery}
                        hasBoundaries={getHasBoundaries()}
                    />
                </Grid>
            </div>
            {allRunFourWarning && (
                <WarningModal
                    warningType={WarningType.AllRunFourWarning}
                    onYes={allRunWarningYes}
                    onNo={clearWarnings}
                />
            )}
            {allRunSixWarning && (
                <WarningModal
                    warningType={WarningType.AllRunSixWarning}
                    onYes={allRunWarningYes}
                    onNo={clearWarnings}
                />
            )}

            {notifyOutcome && <DeliveryNotify outcome={notifyOutcome} onClose={() => setNotifyOutcome(undefined)} />}
        </>
    );
});
