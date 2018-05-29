import * as React from 'react';

const fullWindowStyle: React.CSSProperties = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    position: 'fixed',
};

const modalStyle: React.CSSProperties = {
    ...fullWindowStyle,
    backgroundColor: '#000000',
    opacity: 0.6,
    zIndex: 9000,
};

const warningStyle: React.CSSProperties = {
    ...fullWindowStyle,
    zIndex: 9001,
    padding: '20px',
};

const alertStyle: React.CSSProperties = {
    textAlign: 'center',
};

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
    default:
        return '';
    }
};

export const WarningModal = ({ warningType, onYes, onNo }: WarningModalProps) => (
    <div>
        <div style={modalStyle} />
        <div className="row" style={warningStyle}>
            <div className="col-12" style={alertStyle}>
                <div className="alert alert-danger" role="alert">
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
                </div>
            </div>
        </div>
    </div>
);
