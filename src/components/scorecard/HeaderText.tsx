import * as React from 'react';
import Typography from '@material-ui/core/Typography';

export default (props: any) => (
    <Typography variant="subtitle1" color="inherit" style={props.style}>
        {props.children}
    </Typography>
);
