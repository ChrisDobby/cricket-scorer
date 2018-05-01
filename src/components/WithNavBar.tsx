import * as React from 'react';
import * as styles from './styles';

const containerStyle: React.CSSProperties = {
    ...styles.flexContainerStyle,
    height: '100vh',
};

const componentStyle: React.CSSProperties = {
    ...styles.flexFillStyle,
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
