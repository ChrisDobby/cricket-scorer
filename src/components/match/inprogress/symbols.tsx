import * as React from 'react';
import * as styles from './styles';

const byesDisplayBorder: React.CSSProperties = {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '0 14px 20px 14px',
    float: 'left',
    borderColor: 'transparent transparent #ffffff transparent',
};

const byesDisplayStyle: React.CSSProperties = {
    width: 0,
    height: 0,
    marginLeft: '-12px',
    marginTop: '1px',
    borderStyle: 'solid',
    borderWidth: '0 12px 18px 12px',
    float: 'left',
    borderColor: 'transparent transparent #28a745 transparent',
};

const byesCaptionStyle: React.CSSProperties = {
    marginLeft: '-5px',
    marginTop: '-2px',
};

const legByesDisplayBorder: React.CSSProperties = {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '20px 14px 0 14px',
    float: 'left',
    borderColor: '#ffffff transparent transparent transparent',
};

const legByesDisplayStyle: React.CSSProperties = {
    width: 0,
    height: 0,
    marginTop: '-19px',
    marginLeft: '-12px',
    borderStyle: 'solid',
    borderWidth: '18px 12px 0 12px',
    float: 'left',
    borderColor: '#28a745 transparent transparent transparent',
};

const legByesCaptionStyle: React.CSSProperties = {
    marginLeft: '-5px',
    marginTop: '-24px',
};

const buttonStyle: React.CSSProperties = {
    ...styles.actionButtonStyle,
    paddingLeft: '2px',
    paddingRight: '2px',
};

export const showByes = (caption: string, action: () => void) => {
    return (
        <button
            className="btn btn-success"
            style={buttonStyle}
            onClick={action}
        >
            <div style={byesDisplayBorder}>
                <div style={byesDisplayStyle}>
                    <div style={byesCaptionStyle}>{caption}</div>
                </div>
            </div>
        </button>);
};

export const showLegByes = (caption: string, action: () => void) => {
    return (
        <button
            className="btn btn-success"
            style={buttonStyle}
            onClick={action}
        >
            <div style={legByesDisplayBorder}>
                <div style={legByesDisplayStyle}>
                    <div style={legByesCaptionStyle}>{caption}</div>
                </div>
            </div>
        </button>);
};
