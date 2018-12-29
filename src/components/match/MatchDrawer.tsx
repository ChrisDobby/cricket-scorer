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

type OptionButton = {
    text: string;
    icon: any;
    action: () => void;
};

type MatchDrawerProps = {
    options: OptionButton[];
    isOpen: boolean;
    close: () => void;
    open: () => void;
    classes: any;
    history: any;
};

export default withStyles(themedStyles)((props: MatchDrawerProps) => (
    <Drawer anchor="right" open={props.isOpen} onClose={props.close} onOpen={props.open}>
        <div className={props.classes.toolbar}>
            <IconButton onClick={close}>
                <ChevronRight />
            </IconButton>
        </div>
        <div role="button" onClick={close} onMouseDown={close}>
            <List>
                {props.options.map(option => (
                    <ListItem
                        key={option.text}
                        button
                        dense
                        color="primary"
                        onClick={option.action}
                    >
                        <ListItemIcon>{option.icon}</ListItemIcon>
                        <ListItemText primary={option.text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem
                    button
                    dense
                    color="primary"
                    onClick={() => props.history.push('/matchcentre')}
                >
                    <ListItemText primary="Match centre" />
                </ListItem>
            </List>
        </div>
    </Drawer>));
