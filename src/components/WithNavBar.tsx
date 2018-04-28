import * as React from 'react';

const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
};

const componentStyle: React.CSSProperties = {
    flex: '1',
    overflowY: 'auto',
    overflowX: 'hidden',
    marginTop: '8px',
};

const WithNavBar = (Component: React.ComponentType) => (props: any) => (
    <div style={containerStyle}>
        <nav className="navbar navbar-dark bg-primary">
            <a className="navbar-brand" href="#">Cricket scorer</a>
        </nav>

        <div style={componentStyle}>
            <Component {...props} />
        </div>
    </div>
);

export default WithNavBar;
