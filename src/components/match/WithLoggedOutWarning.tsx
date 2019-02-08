import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Info from '@material-ui/icons/Info';

const warningContainerStyle: React.CSSProperties = {
    margin: '4px',
    textAlign: 'center',
};

const style = (theme: any) => ({
    warning: {
        backgroundColor: 'transparent',
        border: `1px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
        paddingLeft: '5px',
        paddingRight: '5px',
        borderRadius: '4px',
    },
});

const iconStyle: React.CSSProperties = {
    marginRight: '4px',
    marginBottom: '-6px',
};

export default (Component: any) =>
    withStyles(style)((props: any) => (
        <>
            {!props.isAuthenticated && (
                <div style={warningContainerStyle}>
                    <div className={props.classes.warning}>
                        <span>
                            <Typography color="inherit" variant="body2">
                                <Info style={iconStyle} />
                                You are not currently logged in, you can continue to score but the match will not be
                                stored online or appear in live updates
                            </Typography>
                        </span>
                    </div>
                </div>
            )}
            <Component {...props} />
        </>
    ));
