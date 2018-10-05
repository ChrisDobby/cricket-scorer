import * as React from 'react';
import { InningsStatus } from '../../domain';

const fillStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
};

const completeStyle: React.CSSProperties = {
    ...fillStyle,
    backgroundColor: '#000000',
    opacity: 0.8,
};

const alertStyle: React.CSSProperties = {
    ...fillStyle,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
};

interface InningsCompleteProps {
    status: InningsStatus;
    battingTeam: string;
    complete: () => void;
}

const completeText = (state: InningsStatus, battingTeam: string) => {
    switch (state) {
    case InningsStatus.AllOut:
        return `${battingTeam} have been bowled out`;
    case InningsStatus.OversComplete:
        return 'The overs are complete';
    default:
        return '';
    }
};

const InningsComplete = ({ status, battingTeam, complete }: InningsCompleteProps) => (
    <React.Fragment>
        <div style={completeStyle} />
        <div style={alertStyle}>
            <div className="alert alert-dark" style={{ width: '100%' }}>
                <h4 className="alert-heading">Innings complete</h4>
                <p>{completeText(status, battingTeam)}</p>
                <hr />
                <button
                    className="btn btn-dark"
                    onClick={complete}
                >OK
                </button>
            </div>
        </div>
    </React.Fragment>);

export default InningsComplete;
