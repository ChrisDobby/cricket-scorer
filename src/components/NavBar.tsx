import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import SignalWifiOff from '@material-ui/icons/SignalWifiOff';
import NotificationImportant from '@material-ui/icons/NotificationImportant';
import Menu from '@material-ui/icons/Menu';
import NetworkStatusContext from '../context/NetworkStatusContext';
import PageContext from '../context/PageContext';
import WithAuth from './WithAuth';
import WithOutOfDateMatches from './WithOutOfDateMatches';
import { ONLINE, OFFLINE } from '../context/networkStatus';
import { PersistedMatch, Profile } from '../domain';

const grow: React.CSSProperties = {
    flexGrow: 1,
};

interface NavBarProps {
    isAuthenticated: boolean;
    login: () => void;
    logout: (stay: boolean) => void;
    userProfile: Profile;
    outOfDateMatches: PersistedMatch[];
    outOfDateSelected: () => void;
    openDrawer?: () => void;
    children: React.ReactNode;
}

export default WithAuth(WithOutOfDateMatches((props: NavBarProps) => (
    <NetworkStatusContext.Consumer>{({
        status,
    }) =>
        <PageContext.Consumer>{({ stayWhenLoggingOut, title, button }) =>
            <>
                <AppBar position="sticky">
                    <Toolbar>
                        <Typography
                            variant="title"
                            color="inherit"
                            style={grow}
                        >{title || 'Cricket scores live'}
                        </Typography>
                        {!props.isAuthenticated && status === ONLINE &&
                            <Button color="inherit" onClick={props.login}>Register or login</Button>}
                        {props.outOfDateMatches && props.outOfDateMatches.length > 0 &&
                            <IconButton>
                                <Badge
                                    badgeContent={props.outOfDateMatches.length}
                                    color="secondary"
                                    onClick={props.outOfDateSelected}
                                >
                                    <NotificationImportant style={{ color: '#ffffff' }} />
                                </Badge>
                            </IconButton>}
                        {props.isAuthenticated &&
                            <>
                                <Avatar src={props.userProfile.picture} />
                                <Typography color="inherit">{props.userProfile.name}</Typography>
                                <Button
                                    color="inherit"
                                    onClick={() => props.logout(!!stayWhenLoggingOut)}
                                >Logout
                                </Button>
                            </>}
                        {status === OFFLINE && !props.isAuthenticated &&
                            <SignalWifiOff />}
                        {props.openDrawer &&
                            <IconButton
                                color="inherit"
                                aria-label="Open drawer"
                                onClick={props.openDrawer}
                            >
                                <Menu />
                            </IconButton>}
                        {button && button(props)}
                    </Toolbar>
                </AppBar>
                {props.children}
            </>}
        </PageContext.Consumer>}
    </NetworkStatusContext.Consumer>)));
