import * as React from 'react';
import { Team } from '../../../domain';
import * as globalStyles from '../../styles';
import { Bowler } from './Bowler';
import { SaveButton } from '../SaveButton';

export interface SelectBowlerProps {
    bowlingTeam: Team;
    disallowedPlayers: number[];
    initiallySelected?: number;
    selectBowler: (b: number) => void;
}

export class SelectBowler extends React.Component<SelectBowlerProps, {}> {
    state = {
        selectedPlayerIndex: typeof this.props.initiallySelected === 'undefined'
            ? -1
            : this.props.initiallySelected,
    };

    save = () => {
        if (this.state.selectedPlayerIndex >= 0) {
            this.props.selectBowler(this.state.selectedPlayerIndex);
        }
    }

    selectBowler = (playerIndex: number) => {
        this.setState({
            selectedPlayerIndex: playerIndex,
        });
    }

    get canSave() {
        return this.state.selectedPlayerIndex >= 0;
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="d-none d-md-block d-lg-block col-2 col-lg-3" />
                    <div className="col-12 col-md-8 col-lg-6">
                        <div style={globalStyles.sectionContainer}>
                            <div className="row" style={globalStyles.singleHeadingRow}>
                                <h4>Select bowler</h4>
                            </div>
                            {this.props.bowlingTeam.players.map((player, index) => (
                                <Bowler
                                    key={player}
                                    index={index}
                                    selected={index === this.state.selectedPlayerIndex}
                                    name={player}
                                    allowed={this.props.disallowedPlayers.indexOf(index) < 0}
                                    selectBowler={this.selectBowler}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <SaveButton enabled={this.canSave} save={this.save} />
            </div>
        );
    }
}
