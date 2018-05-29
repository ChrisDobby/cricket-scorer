import * as React from 'react';

const buttonStyle: React.CSSProperties = {
    minWidth: '36px',
    margin: '2px',
};

export interface ActionButtonProps {
    caption: string;
    noBall: boolean;
    action: () => void;
}

export const ActionButton = ({ caption, noBall, action }: ActionButtonProps) => (
    <button
        className={`btn ${noBall ? 'btn-danger' : 'btn-success'}`}
        style={buttonStyle}
        onClick={action}
    >{caption}
    </button>
);
