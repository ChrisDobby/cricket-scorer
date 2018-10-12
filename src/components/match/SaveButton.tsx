import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const saveButtonStyle: React.CSSProperties = {
    width: '50px',
    height: '50px',
    padding: '10px 16px',
    fontSize: '18px',
    lineHeight: '1.33',
    borderRadius: '25px',
    boxShadow: '0 4px 6px 0 rgba(0,0,0,.14), 0 4px 5px rgba(0,0,0,-1)',
    position: 'fixed',
    zIndex: 1049,
    right: '10px',
    bottom: '10px',
};

export interface SaveButtonProps {
    enabled: boolean;
    save: () => void;
}

export const SaveButton = ({ enabled, save }: SaveButtonProps) => (
    <button
        type="button"
        style={saveButtonStyle}
        className="btn btn-success"
        disabled={!enabled}
        onClick={save}
    >
        <FontAwesomeIcon icon={faCheck} />
    </button>
);
