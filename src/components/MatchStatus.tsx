import * as React from 'react';
import Fade from '@material-ui/core/Fade';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '@material-ui/core/Button';
import { PersistedMatch, CurrentEditingMatch } from '../domain';

interface MatchStatusProps {
    inProgressMatches: (PersistedMatch | CurrentEditingMatch)[];
    showScorecard: (id: string | undefined) => void;
}

export default (props: MatchStatusProps) => {
    const [currentIndex, setIndex] = React.useState(0);
    const [initialised, setInitialised] = React.useState(false);
    const showCurrentScorecard = () => props.showScorecard(props.inProgressMatches[currentIndex].id);
    const showNext = () => {
        if (currentIndex >= props.inProgressMatches.length - 1) {
            setIndex(0);
        } else {
            setIndex(currentIndex + 1);
        }

        show();
    };

    const show = () => {
        setTimeout(showNext, 4000);
    };

    React.useEffect(() => {
        if (initialised || props.inProgressMatches.length === 0) {
            return;
        }

        setIndex(0);
        setInitialised(true);
        show();
    });

    if (props.inProgressMatches.length === 0) {
        return null;
    }

    return (
        <Fade in={true}>
            <SnackbarContent
                message={props.inProgressMatches[currentIndex].status}
                action={
                    <Button color="secondary" size="small" onClick={showCurrentScorecard}>
                        View scorecard
                    </Button>
                }
            />
        </Fade>
    );
};
