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
    const showTimer = React.useRef(undefined as any);

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
        showTimer.current = setTimeout(showNext, 4000);
    };

    React.useEffect(() => {
        if (initialised || props.inProgressMatches.length === 0) {
            return;
        }

        setIndex(0);
        setInitialised(true);
        show();

        return () => {
            if (showTimer.current) {
                clearTimeout(showTimer.current);
            }
        };
    });

    if (props.inProgressMatches.length === 0) {
        return null;
    }

    return (
        <Fade in={true}>
            <SnackbarContent
                message={
                    props.inProgressMatches[currentIndex].status ||
                    `${props.inProgressMatches[currentIndex].homeTeam} v ${props.inProgressMatches[currentIndex].awayTeam}`
                }
                action={
                    <Button color="inherit" size="small" onClick={showCurrentScorecard}>
                        View scorecard
                    </Button>
                }
            />
        </Fade>
    );
};
