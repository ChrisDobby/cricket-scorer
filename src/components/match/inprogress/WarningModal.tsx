import * as React from 'react';
import WithModal from '../../WithModal';

const buttonStyle: React.CSSProperties = {
    marginLeft: '10px',
    marginRight: '10px',
};

export enum WarningType {
    OverNotCompleteWarning,
    AllRunFourWarning,
    AllRunSixWarning,
}

export interface WarningModalProps {
    warningType: WarningType;
    onYes: () => void;
    onNo: () => void;
}

const allRunWarningText = (runs: string) =>
    `You have entered a ${runs} as all run rather than a boundary.  Is this correct?`;

const warningText = (warningType: WarningType) => {
    switch (warningType) {
    case WarningType.OverNotCompleteWarning:
        return 'There has not been six legal deliveries in this over.  Do you still want to complete it?';
    case WarningType.AllRunFourWarning:
        return allRunWarningText('four');
    case WarningType.AllRunSixWarning:
        return allRunWarningText('six');
    }
};

export const WarningModal = WithModal(({ warningType, onYes, onNo }: WarningModalProps) => (
    <div className="alert alert-danger" role="alert" style={{ width: '100%' }}>
        {warningText(warningType)}
        <div>
            <button
                className="btn btn-danger"
                style={buttonStyle}
                onClick={onYes}
            >Yes
            </button>
            <button
                className="btn btn-default"
                style={buttonStyle}
                onClick={onNo}
            >No
            </button>
        </div>
    </div>));
