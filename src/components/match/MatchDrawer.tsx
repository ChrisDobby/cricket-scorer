import * as React from 'react';
import { default as Drawer } from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { withStyles } from '@material-ui/core/styles';
import { themedStyles } from '../styles';
import { IconButton } from '@material-ui/core';
import { History } from 'history';
import Tooltip from '../Tooltip';

type OptionButton = {
    text: string;
    icon: any;
    title: string;
    action: () => void;
};

type MatchDrawerProps = {
    options: OptionButton[];
    isOpen: boolean;
    close: () => void;
    open: () => void;
    classes: any;
    history: History;
};

export default withStyles(themedStyles)((props: MatchDrawerProps) => (
    <Drawer anchor="right" open={props.isOpen} onClose={props.close} onOpen={props.open}>
        <div className={props.classes.toolbar}>
            <Tooltip title="Close the menu">
                <IconButton onClick={props.close}>
                    <ChevronRight />
                </IconButton>
            </Tooltip>
        </div>
        <div role="button" onClick={close} onMouseDown={close}>
            <List>
                {props.options.map(option => (
                    <Tooltip key={option.text} title={option.title}>
                        <ListItem button dense color="primary" onClick={option.action}>
                            <ListItemIcon>{option.icon}</ListItemIcon>
                            <ListItemText primary={option.text} />
                        </ListItem>
                    </Tooltip>
                ))}
            </List>
            <Divider />
            <List>
                <Tooltip title="Go to the match centre">
                    <ListItem button dense color="primary" onClick={() => props.history.push('/matchcentre')}>
                        <ListItemText primary="Match centre" />
                    </ListItem>
                </Tooltip>
            </List>
        </div>
    </Drawer>
));
