import * as React from 'react';
import { InningsStatus } from '../../../domain';
import WithModal from '../../WithModal';

const buttonStyle: React.CSSProperties = {
    marginLeft: '10px',
    marginRight: '10px',
};

interface InningsCompleteProps {
    status: InningsStatus;
    battingTeam: string;
    complete: () => void;
    undoPrevious: () => void;
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

const InningsComplete = ({ status, battingTeam, complete, undoPrevious }: InningsCompleteProps) => (
    <div className="alert alert-dark" style={{ width: '100%' }}>
        <h4 className="alert-heading">Innings complete</h4>
        <p>{completeText(status, battingTeam)}</p>
        <hr />
        <button
            className="btn btn-dark"
            style={buttonStyle}
            onClick={complete}
        >OK
        </button>
        <button
            className="btn btn-dark"
            style={buttonStyle}
            onClick={undoPrevious}
        >Undo previous
        </button>
    </div>);

export default WithModal(InningsComplete);
