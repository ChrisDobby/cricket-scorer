import * as React from 'react';
import { Match as MatchEntity } from '../../domain';
import { Innings } from './Innings';
import { MatchHeading } from './MatchHeading';
import * as styles from './styles';
import * as globalStyles from '../styles';

const flexContainerStyle: React.CSSProperties = {
    ...globalStyles.flexContainerStyle,
    height: '100%',
};

const inningsRowStyle: React.CSSProperties = {
    ...styles.textCentre,
    marginTop: '4px',
    marginBottom: '4px',
};

const inningButtonStyle: React.CSSProperties = {
    marginLeft: '8px',
    marginRight: '8px',
};

const inningsNumberDescription = (innings: number): string => {
    const numberDescription = (): string => {
        switch (innings) {
        case 1:
            return '1st';
        case 2:
            return '2nd';
        case 3:
            return '3rd';
        default:
            return `${innings}th`;
        }
    };    

    return `${numberDescription()} innings`;
};

export interface ScorecardProps { cricketMatch?: MatchEntity; }

export class Scorecard extends React.Component<ScorecardProps, {}> {
    state = {
        selectedInningsIndex: this.props.cricketMatch && this.props.cricketMatch.innings.length > 0
            ? this.props.cricketMatch.innings.length - 1
            : -1,    
    };

    inningsSelected(index: number) {
        this.setState({ selectedInningsIndex: index });
    }

    render() {
        if (!this.props.cricketMatch) {
            return (
                <div className="col-12" style={styles.textCentre}>
                    <div><i className="fa fa-spinner fa-spin" style={styles.spinnerStyle} /></div>
                </div>);
        }
        return (
            <div style={flexContainerStyle}>
                <div>
                    <MatchHeading
                        homeTeam={this.props.cricketMatch.homeTeam}
                        awayTeam={this.props.cricketMatch.awayTeam}
                        date={this.props.cricketMatch.date}
                        matchStatus={this.props.cricketMatch.status}
                    />
                </div>
                <div style={inningsRowStyle}>
                    {this.props.cricketMatch.innings.map((_, index) => (
                        <button
                            style={inningButtonStyle}    
                            key={index}
                            disabled={index === this.state.selectedInningsIndex}
                            className="btn btn-primary"
                            onClick={() => this.inningsSelected(index)}
                        >{inningsNumberDescription(index + 1)}
                        </button>
                    ))}
                </div>
                <div style={globalStyles.flexFillStyle}>              
                    {this.state.selectedInningsIndex >= 0 &&
                        <Innings innings={this.props.cricketMatch.innings[this.state.selectedInningsIndex]} />}
                </div>
            </div>            
        );
    }
}
