import * as React from 'react';

const buttonStyle: React.CSSProperties = {
    minWidth: '36px',
    margin: '2px',
};

export interface ActionButtonProps {
    caption: string;
    action: () => void;
}

export const ActionButton = ({ caption, action }: ActionButtonProps) => (
    <button className="btn btn-primary" style={buttonStyle} onClick={action}>{caption}</button>
);
