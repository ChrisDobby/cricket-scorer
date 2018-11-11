import * as React from 'react';
import Fade from '@material-ui/core/Fade';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '@material-ui/core/Button';

interface MatchStatusProps {
    inProgressMatches: any[];
    showScorecard: (id: string) => void;
}

export default class extends React.PureComponent<MatchStatusProps> {
    state = {
        currentIndex: 0,
    };

    componentDidMount() {
        if (this.props.inProgressMatches.length === 0) { return; }

        this.setState({ currentIndex: 0 });
        this.show();
    }

    showNext = () => {
        if (this.state.currentIndex >= this.props.inProgressMatches.length - 1) {
            this.setState({ currentIndex: 0 });
        } else {
            this.setState({ currentIndex: this.state.currentIndex + 1 });
        }

        this.show();
    }

    show = () => {
        setTimeout(this.showNext, 4000);
    }

    showCurrentScorecard = () => this.props.showScorecard(this.props.inProgressMatches[this.state.currentIndex].id);

    render() {
        if (this.props.inProgressMatches.length === 0) { return null; }

        return (
            <Fade in={true}>
                <SnackbarContent
                    message={this.props.inProgressMatches[this.state.currentIndex].status}
                    action={<Button color="secondary" size="small" onClick={this.showCurrentScorecard}>
                        View scorecard
                        </Button>}
                />
            </Fade>
        );
    }
}
