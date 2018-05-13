import * as React from 'react';
import { Team } from '../../domain';
import * as styles from './styles';
import * as globalStyles from '../styles';
import { SaveButton } from './SaveButton';

const indicatorStyle: React.CSSProperties = {
    float: 'left',
    width: '30px',
    textAlign: 'center',
};

interface SelectionIndicatorProps {
    playerIndex: number;
    selectedIndex: number;
}

const SelectionIndicator = ({ playerIndex, selectedIndex }: SelectionIndicatorProps) => {
    return (
        <div style={indicatorStyle}>
            {playerIndex === selectedIndex &&
                <i className="fa fa-circle" />}
        </div>
    );
};

export interface SelectBowlerProps {
    bowlingTeam: Team;
    selectBowler: (b: number) => void;
}

export class SelectBowler extends React.Component<SelectBowlerProps, {}> {
    state = { selectedPlayerIndex: -1 };

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
                            <div className="row" style={globalStyles.headingRow}>
                                <h4>Select bowler</h4>
                            </div>
                            {this.props.bowlingTeam.players.map((player, index) => (
                                <div
                                    key={player}
                                    className="row bowler-row"
                                    style={styles.selectablePlayerStyle}
                                    onClick={() => this.selectBowler(index)}
                                >
                                    <SelectionIndicator
                                        playerIndex={index}
                                        selectedIndex={this.state.selectedPlayerIndex}
                                    />
                                    <h6>{player}</h6>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <SaveButton enabled={this.canSave} save={this.save} />
            </div>
        );
    }
}

