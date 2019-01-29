import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import * as dateformat from 'dateformat';
import { OutOfDateMatch } from './WithOutOfDateMatches';

interface OutOfDateDialogProps {
    matches: OutOfDateMatch[];
    disabled: boolean;
    remove: (id: string) => void;
    continue: (id: string) => void;
    close: () => void;
}

export default (props: OutOfDateDialogProps) => (
    <div>
        <Dialog open={true} aria-labelledby="out-of-date-matches-title">
            <DialogTitle id="out-of-date-matches-title">Out of date matches</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {`You have ${props.matches.length} matches that are out of date.  ` + 'Choose what to do with them'}
                </DialogContentText>
                <DialogContentText color="secondary">
                    Note if you remove a match it will be permanently removed
                </DialogContentText>
                <DialogContentText>
                    If you want to complete the match select continue and then complete it
                </DialogContentText>
            </DialogContent>
            {props.matches.map(match => (
                <DialogContent key={match.id}>
                    <Grid container>
                        <Grid item md={6} sm={12}>
                            <DialogContentText color="textPrimary">
                                {`${dateformat(match.date, 'dd-mmm-yyyy')} ` + `${match.homeTeam} v ${match.awayTeam}`}
                            </DialogContentText>
                            <DialogContentText>{match.status}</DialogContentText>
                            {match.removeError && (
                                <DialogContentText color="secondary">
                                    There was an error removing the match. Please try again.
                                </DialogContentText>
                            )}
                            {match.continueError && (
                                <DialogContentText color="secondary">
                                    There was an error continuing the match. Please try again.
                                </DialogContentText>
                            )}
                        </Grid>
                        <Grid item md={6} sm={12}>
                            <DialogActions>
                                {!props.disabled && !match.removed && (
                                    <>
                                        <Button color="primary" onClick={() => props.remove(match.id)}>
                                            Remove
                                        </Button>
                                        <Button color="primary" onClick={() => props.continue(match.id)}>
                                            Continue
                                        </Button>
                                    </>
                                )}
                                {!props.disabled && match.removed && (
                                    <DialogContentText color="secondary">Removed</DialogContentText>
                                )}
                            </DialogActions>
                        </Grid>
                    </Grid>
                    <Divider />
                </DialogContent>
            ))}
            <DialogActions>
                <Button onClick={props.close} color="primary" autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    </div>
);
