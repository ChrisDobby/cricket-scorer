import * as React from 'react';
import WithModal from '../../WithModal';
import { Result, WinBy, MatchResult } from '../../../domain';

const buttonStyle: React.CSSProperties = {
    marginLeft: '10px',
    marginRight: '10px',
};

type MatchCompleteProps = {
    homeTeam: string;
    awayTeam: string;
    disallowCancel?: boolean;
    complete: (result: MatchResult) => void;
    calculateResult: () => MatchResult | undefined;
    cancel: () => void;
    undoPrevious: () => void;
};

class Match extends React.PureComponent<MatchCompleteProps> {
    state = {
        result: undefined,
        winBy: undefined,
        winMargin: undefined,
    };

    componentDidMount() {
        const defaultResult = this.props.calculateResult();
        if (typeof defaultResult !== 'undefined') {
            this.setState({ ...defaultResult });
        }
    }

    selectResult = (ev: React.ChangeEvent<HTMLSelectElement>) =>
        this.setState({ result: ev.target.value ? Number(ev.target.value) : undefined })
    selectWinBy = (ev: React.ChangeEvent<HTMLSelectElement>) =>
        this.setState({ winBy: ev.target.value ? Number(ev.target.value) : undefined })
    marginChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({ winMargin: ev.target.value })
    complete = () =>
        this.props.complete({
            result: Number(this.state.result),
            winBy: this.state.winBy,
            winMargin: this.state.winMargin,
        })
    formComplete = () =>
        this.state.result === Result.Abandoned ||
        this.state.result === Result.Draw ||
        this.state.result === Result.Tie ||
        (typeof this.state.winBy !== 'undefined' && this.state.winMargin)

    render() {
        return (
            <div className="alert alert-dark" style={{ width: '100%' }}>
                <h4 className="alert-heading">Complete match</h4>
                <p>Select the match result followed by OK or Cancel to not complete the innings</p>
                <form>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <select
                                id="result"
                                className="custom-select"
                                value={this.state.result}
                                onChange={this.selectResult}
                            >
                                <option>Select result..</option>
                                <option value={Result.HomeWin}>{`${this.props.homeTeam} won`}</option>
                                <option value={Result.AwayWin}>{`${this.props.awayTeam} won`}</option>
                                <option value={Result.Tie}>Match tied</option>
                                <option value={Result.Draw}>Match drawn</option>
                                <option value={Result.Abandoned}>Match abandoned</option>
                            </select>
                        </div>
                        {(this.state.result === Result.HomeWin || this.state.result === Result.AwayWin) &&
                            <React.Fragment>
                                <div className="form-group col-md-6 row">
                                    <label htmlFor="winMargin" className="col-2 col-form-label">by</label>
                                    <div className="col-5">
                                        <input
                                            id="winMargin"
                                            className="form-control"
                                            value={this.state.winMargin}
                                            onChange={this.marginChange}
                                        />
                                    </div>
                                    <div className="col-5">
                                        <select
                                            className="custom-select"
                                            value={this.state.winBy}
                                            onChange={this.selectWinBy}
                                        >
                                            <option>Select..</option>
                                            <option value={WinBy.Runs}>runs</option>
                                            <option value={WinBy.Wickets}>wickets</option>
                                        </select>
                                    </div>
                                </div>
                            </React.Fragment>}
                    </div>
                </form>
                <hr />
                <button
                    className="btn btn-dark"
                    style={buttonStyle}
                    disabled={!this.formComplete()}
                    onClick={this.complete}
                >OK
                </button>
                {!this.props.disallowCancel &&
                    <button
                        className="btn btn-dark"
                        style={buttonStyle}
                        onClick={this.props.cancel}
                    >Cancel
                    </button>}
                <button
                    className="btn btn-dark"
                    style={buttonStyle}
                    onClick={this.props.undoPrevious}
                >Undo previous
                </button>
            </div>);
    }
}

export default WithModal(Match);
