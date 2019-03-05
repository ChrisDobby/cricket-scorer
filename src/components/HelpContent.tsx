import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import HelpOutline from '@material-ui/icons/HelpOutline';
import Hidden from '@material-ui/core/Hidden';
import Menu from '@material-ui/icons/Menu';

const WicketNoBall = () => (
    <div style={{ display: 'flex' }}>
        <HelpOutline />
        <Typography color="inherit" variant="caption" style={{ marginLeft: '4px' }}>
            Press the WICKET button to record a wicket this delivery and toggle between no ball or not using the 'No
            ball' switch
        </Typography>
    </div>
);

const ScoreType = () => (
    <div style={{ display: 'flex' }}>
        <HelpOutline />
        <Typography color="inherit" variant="caption" style={{ marginLeft: '4px' }}>
            <Hidden smUp>Select whether the delivery is runs (ru), byes (b), leg byes (lb) or wides (wd)</Hidden>
            <Hidden xsDown>Select whether the delivery is runs or extras (byes, leg byes, wides)</Hidden>
        </Typography>
    </div>
);

const RunsScored = () => (
    <div style={{ display: 'flex' }}>
        <HelpOutline />
        <Typography color="inherit" variant="caption" style={{ marginLeft: '4px' }}>
            Select the number of runs scored for this delivery using the buttons or the drop down
        </Typography>
    </div>
);

const CurrentOver = () => (
    <div style={{ display: 'flex' }}>
        <HelpOutline />
        <Typography color="inherit" variant="caption" style={{ marginLeft: '4px' }}>
            Shows the detail for the over that is in progress
        </Typography>
    </div>
);

const CloseHelp = () => (
    <Typography color="inherit" variant="caption" style={{ marginLeft: '4px', maxWidth: '180px' }}>
        Click <HelpOutline /> button to show and hide the help boxes
    </Typography>
);

const DrawerMenu = () => (
    <div style={{ display: 'flex', maxWidth: '180px' }}>
        <HelpOutline />
        <Typography color="inherit" variant="caption" style={{ marginLeft: '4px' }}>
            Use the <Menu /> menu to correct any mistakes, complete matches, swap batters ends and more
        </Typography>
    </div>
);

export default { WicketNoBall, ScoreType, RunsScored, CurrentOver, CloseHelp, DrawerMenu };
