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

type EntryPanelProps = RouteComponentProps<{}> & {
    overComplete: boolean;
    delivery: (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => void;
    homeTeam: string;
    awayTeam: string;
    calculateResult: () => MatchResult | undefined;
};

interface EntryPanelState {
    noBall: boolean;
    scoreType: ScoreType;
    allRunFourWarning: boolean;
    allRunSixWarning: boolean;
    allRunDeliveryOutcome: DeliveryOutcome | undefined;
    allRunScores: DeliveryScores | undefined;
    notifyOutcome: Outcome | undefined;
}

class EntryPanel extends React.Component<EntryPanelProps, {}> {
    state: EntryPanelState = {
        noBall: false,
        scoreType: ScoreType.Runs,
        allRunFourWarning: false,
        allRunSixWarning: false,
        allRunDeliveryOutcome: undefined,
        allRunScores: undefined,
        notifyOutcome: undefined,
    };

    notifyDelivery = (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) =>
        this.setState({
            notifyOutcome: {
                deliveryOutcome,
                scores,
            },
        })

    notificationClosed = () => this.setState({ notifyOutcome: undefined });

    noBallPressed = () => {
        this.setState({
            noBall: true,
            scoreType: this.state.scoreType === ScoreType.Wide ? ScoreType.Runs : this.state.scoreType,
        });
    }

    legalBallPressed = () => this.setState({ noBall: false });

    scoreTypeChange = (scoreType: ScoreType) => this.setState({ scoreType });

    addDelivery = (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => {
        this.props.delivery(deliveryOutcome, scores);
        this.notifyDelivery(deliveryOutcome, scores);
        this.setState({ noBall: false });
    }

    delivery = (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores) => {
        if (typeof scores.runs !== 'undefined' && (scores.runs === 4 || scores.runs === 6)) {
            this.setState({
                allRunFourWarning: scores.runs === 4,
                allRunSixWarning: scores.runs === 6,
                allRunDeliveryOutcome: deliveryOutcome,
                allRunScores: scores,
            });
            return;
        }

        this.addDelivery(deliveryOutcome, scores);
    }

    warningNo = () => {
        this.clearWarnings();
    }

    clearWarnings = () => {
        this.setState({
            allRunFourWarning: false,
            allRunSixWarning: false,
            allRunDeliveryOutcome: undefined,
            allRunScores: undefined,
        });
    }

    allRunWarningYes = () => {
        if (typeof this.state.allRunDeliveryOutcome !== 'undefined' &&
            typeof this.state.allRunScores !== 'undefined') {
            this.addDelivery(
                this.state.allRunDeliveryOutcome,
                this.state.allRunScores);
        }

        this.clearWarnings();
    }

    getScore = (field: string) => (score: number) => ({
        [field]: score,
    })

    get scoresFunc() {
        switch (this.state.scoreType) {
        case ScoreType.Byes:
            return this.getScore('byes');
        case ScoreType.LegByes:
            return this.getScore('legByes');
        case ScoreType.Wide:
            return this.getScore('wides');
        default:
            return this.getScore('runs');
        }
    }

    get hasBoundaries() {
        return this.state.scoreType === ScoreType.Runs;
    }

    get deliveryOutcome(): DeliveryOutcome {
        if (this.state.noBall) { return DeliveryOutcome.Noball; }
        if (this.state.scoreType === ScoreType.Wide) { return DeliveryOutcome.Wide; }
        return DeliveryOutcome.Valid;
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <Grid container>
                        <Button
                            style={{ marginRight: '10px' }}
                            variant="fab"
                            aria-label="Wicket"
                            color="primary"
                            onClick={() => this.props.history.push('/match/wicket')}
                        >{'W'}
                        </Button>
                        <FormControlLabel
                            style={{ float: 'right' }}
                            label="No ball"
                            control={
                                <Switch
                                    color="secondary"
                                    checked={this.state.noBall}
                                    onChange={ev => ev.target.checked ? this.noBallPressed() : this.legalBallPressed()}
                                />}
                        />
                    </Grid>
                    <Grid container>
                        <Grid item xs={12}>
                            <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <ScoreTypeSelect
                            selectedType={this.state.scoreType}
                            noBall={this.state.noBall}
                            scoreTypeChange={this.scoreTypeChange}
                        />
                    </Grid>
                    <Grid container>
                        <ScoresEntry
                            deliveryOutcome={this.deliveryOutcome}
                            getScores={this.scoresFunc}
                            action={this.delivery}
                            hasBoundaries={this.hasBoundaries}
                        />
                    </Grid>
                </div>
                {this.state.allRunFourWarning &&
                    <WarningModal
                        warningType={WarningType.AllRunFourWarning}
                        onYes={this.allRunWarningYes}
                        onNo={this.warningNo}
                    />}
                {this.state.allRunSixWarning &&
                    <WarningModal
                        warningType={WarningType.AllRunSixWarning}
                        onYes={this.allRunWarningYes}
                        onNo={this.warningNo}
                    />}

                {this.state.notifyOutcome &&
                    <DeliveryNotify outcome={this.state.notifyOutcome} onClose={this.notificationClosed} />}
            </React.Fragment>);
    }
}

export default withRouter(EntryPanel);
