import * as React from 'react';
import * as globalStyles from '../styles';
import { BatterSelector, PlayerPosition } from './BatterSelector';
import { SaveButton } from './SaveButton';
import { Batting } from '../../domain';

interface SelectNewBatterProps {
    batting: Batting;
    players: string[];
    batterSelected: (playerIndex: number) => void;
}

export default class extends React.Component<SelectNewBatterProps, {}> {
    state = {
        playerPositions: Array<PlayerPosition>(),
    };

    playerSelected = (playerIndex: number, position: number) => {
        this.setState({
            playerPositions: [{ playerIndex, position }],
        });
    }

    save = () => {
        this.props.batterSelected(this.state.playerPositions[0].playerIndex);
    }

    get canSave() { return this.state.playerPositions.length === 1; }

    get availablePosition(): number {
        return this.props.batting.batters.map((batter, index) => ({ batter, position: index + 1 }))
            .filter(batterPos => typeof batterPos.batter.innings === 'undefined')[0].position;
    }

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="d-none d-md-block d-lg-block col-2 col-lg-3" />
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="row" style={globalStyles.singleHeadingRow}>
                            <h4>Select batter {this.availablePosition}</h4>
                        </div>
                        <BatterSelector
                            players={this.props.players}
                            playerPositions={this.state.playerPositions}
                            availablePositions={[this.availablePosition]}
                            notAllowedPlayers={this.props.batting.batters
                                .filter(batter => batter.innings).map(batter => batter.playerIndex)}
                            playerSelected={this.playerSelected}
                            playerRemoved={() => { }}
                        />
                    </div>
                </div>
                <SaveButton enabled={this.canSave} save={this.save} />
            </React.Fragment>);
    }
}
