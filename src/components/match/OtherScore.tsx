import * as React from 'react';

const selectStyle: React.CSSProperties = {
    width: '84px',
};

const buttonStyle: React.CSSProperties = {
    margin: '2px',
};

export interface OtherScoreProps {
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
            <span>
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
                    className="btn btn-primary"
                    style={buttonStyle}
                    onClick={this.valueSelected}
                >
                    <i className="fa fa-check" />
                </button>
            </span>
        );
    }
}
