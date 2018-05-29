import * as React from 'react';
import * as styles from './styles';

const noBallDisplayStyle: React.CSSProperties = {
    borderRadius: '50%',
    borderColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: '1px',
};

export interface ActionButtonProps {
    caption: string;
    noBall: boolean;
    action: () => void;
    show?: (caption: string, action: () => void) => JSX.Element;
}

export const ActionButton = ({ caption, noBall, action, show }: ActionButtonProps) => {
    if (noBall) {
        return (
            <button
                className="btn btn-danger"
                style={styles.symbolButtonStyle}
                onClick={action}
            ><div style={noBallDisplayStyle}>{caption}</div>
            </button>
        );
    }

    if (!show) {
        return (
            <button
                className="btn btn-success"
                style={styles.actionButtonStyle}
                onClick={action}
            >{caption}
            </button>
        );
    }

    return show(caption, action);
};
