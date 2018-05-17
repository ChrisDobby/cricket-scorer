import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { InProgressMatch, Team, State } from '../../domain';
import WithNavBar from '../WithNavBar';
import { StartInnings } from './StartInnings';
import { SelectBowler } from './SelectBowler';
import { BallEntry } from './BallEntry';
import * as actions from '../../actions/index';
import { BallFunctions } from './EntryPanel';

interface InProgressProps {
    match: InProgressMatch;
    startInnings?: (t: Team, b1: number, b2: number) => void;
    newBowler?: (b: number) => void;
    ballFunctions?: BallFunctions;
}

class InProgress extends React.Component<InProgressProps, {}> {
    render() {
        if (!this.props.match.currentInnings && this.props.startInnings) {
            return (
                <StartInnings
                    teams={[this.props.match.homeTeam, this.props.match.awayTeam]}
                    startInnings={this.props.startInnings}
                />
            );
        }

        if (this.props.match.currentInnings && !this.props.match.currentBowler && this.props.newBowler) {
            return (
                <SelectBowler
                    bowlingTeam={this.props.match.currentInnings.bowlingTeam}
                    selectBowler={this.props.newBowler}
                />);
        }

        if (this.props.match.currentInnings &&
            this.props.match.currentBatter &&
            this.props.match.currentBowler &&
            this.props.ballFunctions) {
            return (
                <BallEntry
                    innings={this.props.match.currentInnings}
                    batter={this.props.match.currentBatter}
                    bowler={this.props.match.currentBowler}
                    overComplete={!!this.props.match.currentOverComplete}
                    ballFunctions={this.props.ballFunctions}
                />
            );
        }

        return <div />;
    }
}

const mapStateToProps = (state: State) => ({
    match: state.match,
});

const mapDispatchToProps = (dispatch: Dispatch<actions.InningsAction>) => ({
    startInnings: (team: Team, batter1Index: number, batter2Index: number) =>
        dispatch(actions.startInnings(team, batter1Index, batter2Index)),
    newBowler: (bowlerIndex: number) => dispatch(actions.newBowler(bowlerIndex)),
    ballFunctions: {
        dotBall: () => dispatch(actions.dotBall()),
        completeOver: () => dispatch(actions.completeOver()),
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(WithNavBar(InProgress));
