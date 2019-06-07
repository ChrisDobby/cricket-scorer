import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import deepOrange from '@material-ui/core/colors/deepOrange';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import SignalWifiOff from '@material-ui/icons/SignalWifiOff';
import NotificationImportant from '@material-ui/icons/NotificationImportant';
import List from '@material-ui/icons/List';
import Menu from '@material-ui/icons/Menu';
import NetworkStatusContext from '../context/NetworkStatusContext';
import PageContext from '../context/PageContext';
import WithAuth from './WithAuth';
import WithOutOfDateMatches from './WithOutOfDateMatches';
import { ONLINE, OFFLINE } from '../context/networkStatus';
import { PersistedMatch, Profile } from '../domain';
import { History } from 'history';
import Tooltip from './Tooltip';
import Help from './Help';
import HelpTooltip from './HelpTooltip';
import HelpContent from './HelpContent';
import Footer from './Footer';

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
    history: History;
    children: React.ReactNode;
}

const getInitials = (name: string) =>
    name
        .split(' ')
        .map(part => part.trim())
        .filter(part => part.length > 0)
        .map(part => part[0].toUpperCase())
        .join('');

export default WithAuth(
    WithOutOfDateMatches((props: NavBarProps) => {
        const pageContext = React.useContext(PageContext);
        const { status } = React.useContext(NetworkStatusContext);
        return (
            <>
                <AppBar position="sticky">
                    <Toolbar>
                        {pageContext.showMatchesLink && (
                            <Tooltip title="Go to the match centre">
                                <IconButton
                                    style={{ marginRight: '8px', color: '#ffffff' }}
                                    onClick={() => props.history.push('/matchcentre')}
                                >
                                    <List />
                                </IconButton>
                            </Tooltip>
                        )}
                        {pageContext.showHelp && <Help />}
                        <Typography variant="title" color="inherit" style={grow}>
                            {pageContext.title}
                        </Typography>
                        {!props.isAuthenticated && status === ONLINE && (
                            <Button color="inherit" onClick={props.login}>
                                Register or login
                            </Button>
                        )}
                        {props.outOfDateMatches && props.outOfDateMatches.length > 0 && (
                            <Tooltip
                                title={`You have ${props.outOfDateMatches.length} out of date matches.  Click to view`}
                            >
                                <IconButton>
                                    <Badge
                                        badgeContent={props.outOfDateMatches.length}
                                        color="secondary"
                                        onClick={props.outOfDateSelected}
                                    >
                                        <NotificationImportant style={{ color: '#ffffff' }} />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                        )}
                        {props.isAuthenticated && (
                            <>
                                {props.userProfile.picture && <Avatar src={props.userProfile.picture} />}
                                {!props.userProfile.picture && (
                                    <Avatar style={{ backgroundColor: deepOrange[500] }}>
                                        {getInitials(props.userProfile.name)}
                                    </Avatar>
                                )}
                                <Tooltip title="Log out of the application.  You will still be able to view and score matches but they will not be updated live">
                                    <Button
                                        color="inherit"
                                        onClick={() => props.logout(pageContext.stayWhenLoggingOut)}
                                    >
                                        Logout
                                    </Button>
                                </Tooltip>
                            </>
                        )}
                        {status === OFFLINE && !props.isAuthenticated && <SignalWifiOff />}
                        {pageContext.openDrawer && (
                            <HelpTooltip title={<HelpContent.DrawerMenu />} displayUnder>
                                <span>
                                    <Tooltip title="Open the match options menu">
                                        <IconButton
                                            color="inherit"
                                            aria-label="Open drawer"
                                            onClick={pageContext.openDrawer}
                                        >
                                            <Menu />
                                        </IconButton>
                                    </Tooltip>
                                </span>
                            </HelpTooltip>
                        )}
                        {pageContext.button && pageContext.button(props)}
                    </Toolbar>
                </AppBar>
                {props.children}
                <Footer />
            </>
        );
    }),
);
