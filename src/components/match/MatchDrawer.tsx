import * as React from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { withStyles } from '@material-ui/core/styles';
import { themedStyles } from '../styles';
import { IconButton } from '@material-ui/core';

type OptionButton = {
    text: string;
    icon: any;
    action: any;
};

type MatchDrawerProps = {
    options: OptionButton[];
    isOpen: boolean;
    close: () => void;
    classes: any;
};

export default withStyles(themedStyles)(({ options, isOpen, close, classes }: MatchDrawerProps) => (
    <Drawer anchor="right" open={isOpen} onClose={close}>
        <div className={classes.toolbar}>
            <IconButton onClick={close}>
                <ChevronRight />
            </IconButton>
        </div>
        <div role="button" onClick={close} onMouseDown={close}>
            <List>
                {options.map(option => (
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
        </div>
    </Drawer>));
