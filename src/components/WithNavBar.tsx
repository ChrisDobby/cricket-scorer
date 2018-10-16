import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import SignalWifiOff from '@material-ui/icons/SignalWifiOff';
import NetworkStatusContext from '../context/NetworkStatusContext';
import { ONLINE, OFFLINE } from '../context/networkStatus';

const grow: React.CSSProperties = {
    flexGrow: 1,
};

const WithNavBar = (Component: any) => (props: any) => (
    <NetworkStatusContext.Consumer>{({
        status,
    }) =>
        <React.Fragment>
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="title" color="inherit" style={grow}>Cricket scores live</Typography>
                    {!props.isAuthenticated && status === ONLINE &&
                        <Button color="inherit" onClick={props.login}>Register or login</Button>}
                    {props.isAuthenticated &&
                        <React.Fragment>
                            <Avatar src={props.userProfile.picture} />
                            <Typography color="inherit">{props.userProfile.name}</Typography>
                            <Button color="inherit" onClick={props.logout}>Logout</Button>
                        </React.Fragment>}
                    {status === OFFLINE && !props.isAuthenticated &&
                        <SignalWifiOff />}
                </Toolbar>
            </AppBar>
            <Component {...props} />
        </React.Fragment>}
    </NetworkStatusContext.Consumer>);

export default WithNavBar;
