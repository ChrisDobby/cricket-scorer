import * as React from 'react';
import WithModal from '../../WithModal';

const buttonStyle: React.CSSProperties = {
    marginLeft: '10px',
    marginRight: '10px',
};

interface SaveWarningProps {
    homePlayersMissing: number;
    awayPlayersMissing: number;
    save: () => void;
    cancel: () => void;
}

const SaveWarning = ({ homePlayersMissing, awayPlayersMissing, save, cancel }: SaveWarningProps) => (
    <div className="alert alert-dark" style={{ width: '100%' }}>
        <h4 className="alert-heading">Missing players</h4>
        {homePlayersMissing > 0 &&
            <p>There are {homePlayersMissing} missing from the home team</p>}
        {awayPlayersMissing > 0 &&
            <p>There are {awayPlayersMissing} missing from the away team</p>}
        <p>Do you want to create the match anyway</p>
        <hr />
        <button
            className="btn btn-dark"
            style={buttonStyle}
            onClick={save}
        >Yes
        </button>
        <button
            className="btn btn-dark"
            style={buttonStyle}
            onClick={cancel}
        >No
        </button>
    </div>);

export default WithModal(SaveWarning);
