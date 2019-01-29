import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const entryPaperStyle: React.CSSProperties = {
    padding: '10px',
    height: '100%',
};

export default (props: any) => (
    <Paper elevation={1} style={entryPaperStyle}>
        <Grid container>{props.children}</Grid>
    </Paper>
);
