import * as React from 'react';

const fillStyle: React.CSSProperties = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    position: 'fixed',
};

const backgroundStyle: React.CSSProperties = {
    ...fillStyle,
    backgroundColor: '#000000',
    opacity: 0.8,
    zIndex: 9000,
};

const contentStyle: React.CSSProperties = {
    ...fillStyle,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    zIndex: 9001,
    padding: '20px',
};

export default (Component: any) => (props: any) => (
    <React.Fragment>
        <div style={backgroundStyle} />
        <div style={contentStyle}>
            <Component {...props} />
        </div>
    </React.Fragment>);
