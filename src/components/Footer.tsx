import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme: any) => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    },
});

const footerStyle: React.CSSProperties = {
    position: 'fixed',
    right: 0,
    bottom: 0,
    left: 0,
    textAlign: 'center',
    height: '35px',
    backgroundColor: 'white',
};

const linkStyle: React.CSSProperties = {
    fontFamily: 'FontAwesome',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '1.5em',
    textDecoration: 'none',
    color: '#000000',
};

const itemStyle: React.CSSProperties = {
    display: 'inline-block',
    marginLeft: '10px',
    marginRight: '10px',
};

const Footer = (props: any) => (
    <div style={footerStyle}>
        <Paper className={props.classes.root}>
            <ul style={{ margin: 0 }}>
                <li style={{ ...itemStyle, marginLeft: 0 }}>
                    <a
                        href="https://twitter.com/chrisdobby"
                        style={linkStyle}
                        className="fa-twitter"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Go to ChrisDobby on Twitter"
                    >
                        <span style={{ display: 'none' }}>Twitter</span>
                    </a>
                </li>
                <li style={itemStyle}>
                    <a
                        href="https://chrisdobby.dev"
                        style={linkStyle}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Go to chrisdobby.dev"
                    >
                        <span style={{ display: 'none' }}>Website</span>
                        <i className="fas fa-globe" />
                    </a>
                </li>
                <li style={{ ...itemStyle, marginRight: 0 }}>
                    <a
                        href="https://github.com/chrisdobby/cricket-scorer"
                        style={linkStyle}
                        className="fab fa-github"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Go to the cricket scorer github page"
                    >
                        <span style={{ display: 'none' }}>Github</span>
                    </a>
                </li>
            </ul>
        </Paper>
    </div>
);

export default withStyles(styles)(Footer);
