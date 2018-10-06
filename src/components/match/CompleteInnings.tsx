import * as React from 'react';
import { InningsStatus } from '../../domain';
import WithModal from '../WithModal';

const buttonStyle: React.CSSProperties = {
    marginLeft: '10px',
    marginRight: '10px',
};

interface CompleteInningsProps {
    complete: (status: InningsStatus) => void;
    cancel: () => void;
}

class CompleteInnings extends React.Component<CompleteInningsProps> {
    state = { status: InningsStatus.Declared };
    selectionChanged = (ev: React.ChangeEvent<HTMLSelectElement>) => this.setState({ status: ev.target.value });
    render() {
        return (
            <div className="alert alert-dark" style={{ width: '100%' }}>
                <h4 className="alert-heading">Complete innings</h4>
                <p>Select the reason for completing the innings followed by OK or Cancel to not complete the innings</p>
                <div className="row">
                    <div className="d-none d-md-block col-3" />
                    <div className="col-12 col-md-6">
                        <select className="custom-select" value={this.state.status} onChange={this.selectionChanged}>
                            <option value={InningsStatus.Declared}>Declared</option>
                            <option value={InningsStatus.AllOut}>All out</option>
                            <option value={InningsStatus.OversComplete}>Overs complete</option>
                        </select>
                    </div>
                </div>
                <hr />
                <button
                    className="btn btn-dark"
                    style={buttonStyle}
                    onClick={() => this.props.complete(this.state.status)}
                >OK
                </button>
                <button
                    className="btn btn-dark"
                    style={buttonStyle}
                    onClick={this.props.cancel}
                >Cancel
                </button>
            </div>);
    }
}

export default WithModal(CompleteInnings);
