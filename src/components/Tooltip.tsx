import * as React from 'react';
import Zoom from '@material-ui/core/Zoom';
import Tooltip from '@material-ui/core/Tooltip';

interface TooltipProps {
    title: string;
    children: any;
}

export default (props: TooltipProps) => (
    <Tooltip TransitionComponent={Zoom} title={props.title}>
        {props.children}
    </Tooltip>
);
