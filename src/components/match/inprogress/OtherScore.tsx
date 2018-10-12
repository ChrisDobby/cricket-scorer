import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const containerStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
};

const selectStyle: React.CSSProperties = {
    width: '84px',
};

const buttonStyle: React.CSSProperties = {
    margin: '2px',
};

export interface OtherScoreProps {
    noBall: boolean;
    action: (runs: number) => void;
}

export class OtherScore extends React.PureComponent<OtherScoreProps, {}> {
    state = { selectedValue: 'other' };

    valueChanged = (event: React.FormEvent<HTMLSelectElement>): void => {
        this.setState({
            selectedValue: event.currentTarget.value,
        });
    }

    valueSelected = (): void => {
        if (this.state.selectedValue === 'other') { return; }

        this.props.action(Number(this.state.selectedValue));

        this.setState({ selectedValue: 'other' });
    }

    render() {
        return (
            <span style={containerStyle}>
                <select
                    className="custom-select"
                    style={selectStyle}
                    value={this.state.selectedValue}
                    onChange={this.valueChanged}
                >
                    <option>other</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
                <button
                    disabled={this.state.selectedValue === 'other'}
                    className={`btn ${this.props.noBall ? 'btn-danger' : 'btn-success'}`}
                    style={buttonStyle}
                    onClick={this.valueSelected}
                >
                    <FontAwesomeIcon icon={faCheck} />
                </button>
            </span>
        );
    }
}
