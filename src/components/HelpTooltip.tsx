import * as React from 'react';
import Zoom from '@material-ui/core/Zoom';
import Tooltip from '@material-ui/core/Tooltip';
import HelpContext from '../context/HelpContext';
import withStyles from '@material-ui/core/styles/withStyles';

interface HelpTooltipProps {
    title: React.ReactNode;
    displayUnder?: boolean;
    displayOver?: boolean;
    classes: any;
    children: any;
}

const styles = (theme: any) => ({
    tooltip: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
});

const getPlacement = (displayUnder: boolean | undefined, displayOver: boolean | undefined) => {
    if (displayUnder) return 'bottom-start';
    if (displayOver) return 'top-end';
    return 'right';
};
export default withStyles(styles)((props: HelpTooltipProps) => {
    const { visible } = React.useContext(HelpContext);
    return (
        <Tooltip
            classes={{ tooltip: props.classes.tooltip }}
            placement={getPlacement(props.displayUnder, props.displayOver)}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            TransitionComponent={Zoom}
            title={visible ? props.title : <></>}
            open={visible}
        >
            {props.children}
        </Tooltip>
    );
});
