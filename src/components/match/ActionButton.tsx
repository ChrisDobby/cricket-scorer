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
    buttonClass?: string;
    noBall: boolean;
    action: () => void;
    show?: (caption: string, action: () => void) => JSX.Element;
}

export const ActionButton = ({ caption, buttonClass, noBall, action, show }: ActionButtonProps) => {
    const cls = typeof buttonClass === 'undefined' ? 'btn btn-success' : `btn ${buttonClass}`;

    if (noBall) {
        return (
            <button
                className={cls}
                style={styles.symbolButtonStyle}
                onClick={action}
            ><div style={noBallDisplayStyle}>{caption}</div>
            </button>
        );
    }

    if (!show) {
        return (
            <button
                className={cls}
                style={styles.actionButtonStyle}
                onClick={action}
            >{caption}
            </button>
        );
    }

    return show(caption, action);
};
