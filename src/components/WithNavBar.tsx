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

const profileItemStyle: React.CSSProperties = {
    marginRight: '8px',
};

const pictureStyle: React.CSSProperties = {
    ...profileItemStyle,
    borderRadius: '35px',
    width: '35px',
    height: '35px',
    boxShadow: '0 4px 6px 0 rgba(0,0,0,.14), 0 4px 5px rgba(0,0,0,-1)',
};

const WithNavBar = (Component: React.ComponentType) => (props: any) => (
    <div style={containerStyle}>
        <nav className="navbar navbar-dark bg-primary">
            <a className="navbar-brand" href="#">Cricket scores live</a>
            {!props.isAuthenticated &&
                <button className="btn btn-outline-light" onClick={props.login}>Register or login</button>}
            {props.isAuthenticated &&
                <span>
                    {props.userProfile &&
                        <React.Fragment>
                            {props.userProfile.picture &&
                                <img src={props.userProfile.picture} style={pictureStyle} />}
                            <span className="navbar-text" style={profileItemStyle}>{props.userProfile.name}</span>
                        </React.Fragment>}
                    <button className="btn btn-outline-light" onClick={props.logout}>Logout</button>
                </span>}
        </nav>

        <div style={componentStyle}>
            <Component {...props} />
        </div>
    </div>);

export default WithNavBar;
