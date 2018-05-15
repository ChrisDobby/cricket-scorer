import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Match, Innings, Team, Batter, Bowler, Delivery, State } from '../../domain';
import WithNavBar from '../WithNavBar';
import { StartInnings } from './StartInnings';
import { SelectBowler } from './SelectBowler';
import { BallEntry } from './BallEntry';
import * as actions from '../../actions/index';
import { BallFunctions } from './EntryPanel';

interface InProgressProps {
    match: Match;
    currentInnings?: Innings;
    currentBatter?: Batter;
    currentBowler?: Bowler;
    currentOver?: Delivery[];
    startInnings?: (t: Team, b1: number, b2: number) => void;
    newBowler?: (b: number) => void;
    ballFunctions?: BallFunctions;
}

class InProgress extends React.Component<InProgressProps, {}> {
    render() {
        if (!this.props.currentInnings && this.props.startInnings) {
            return (
                <StartInnings
                    teams={[this.props.match.homeTeam, this.props.match.awayTeam]}
                    startInnings={this.props.startInnings}
                />
            );
        }

        if (this.props.currentInnings && !this.props.currentBowler && this.props.newBowler) {
            return (
                <SelectBowler
                    bowlingTeam={this.props.currentInnings.bowlingTeam}
                    selectBowler={this.props.newBowler}
                />);
        }

        if (this.props.currentInnings &&
            this.props.currentBatter &&
            this.props.currentBowler &&
            this.props.currentOver &&
            this.props.ballFunctions) {
            console.log(this.props.currentOver);
            return (
                <BallEntry
                    innings={this.props.currentInnings}
                    batter={this.props.currentBatter}
                    bowler={this.props.currentBowler}
                    over={this.props.currentOver}
                    ballFunctions={this.props.ballFunctions}
                />
            );
        }

        return <div />;
    }
}

const mapStateToProps = (state: State) => ({
    match: state.match,
    currentInnings: state.currentInnings,
    currentBatter: state.currentBatter,
    currentBowler: state.currentBowler,
    currentOver: state.currentOver,
});

const mapDispatchToProps = (dispatch: Dispatch<actions.InningsAction>) => ({
    startInnings: (team: Team, batter1Index: number, batter2Index: number) =>
        dispatch(actions.startInnings(team, batter1Index, batter2Index)),
    newBowler: (bowlerIndex: number) => dispatch(actions.newBowler(bowlerIndex)),
    ballFunctions: {
        dotBall: () => dispatch(actions.dotBall()),
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(WithNavBar(InProgress));
