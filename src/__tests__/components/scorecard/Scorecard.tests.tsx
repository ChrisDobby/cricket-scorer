import * as React from 'react';
import { shallow } from 'enzyme';
import * as ReactTestRenderer from 'react-test-renderer';
import { Scorecard } from '../../../components/scorecard/Scorecard';
import { Innings } from '../../../domain';
import { match, homeTeam, awayTeam } from '../../testData/testMatch';

describe('Scorecard', () => {
    it('should change selected innings when button clicked', () => {
        const scorecard = shallow(<Scorecard cricketMatch={match} />);
        scorecard.find('button').at(0).simulate('click');

        expect(scorecard.state().selectedInningsIndex).toBe(0);
    });

    it('should render correctly when no match available', () => {
        const scorecard = ReactTestRenderer.create(<Scorecard />);

        expect(scorecard.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when match available', () => {
        const scorecard = ReactTestRenderer.create(<Scorecard cricketMatch={match} />);

        expect(scorecard.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when match has four innings', () => {
        const thirdInnings: Innings = {
            battingTeam: homeTeam,
            bowlingTeam: awayTeam,
            score: 0,
            wickets: 0,
            completedOvers: 0,
            totalOvers: '0',
            deliveries: [],
            allOut: false,
            complete: false,
            batting: {
                extras: {
                    byes: 0,
                    legByes: 0,
                    noBalls: 0,
                    wides: 0,
                    penaltyRuns: 0,
                },
                batters: [],
            },
            bowlers: [],
            fallOfWickets: [],
        };
        const fourthInnings: Innings = {
            battingTeam: awayTeam,
            bowlingTeam: homeTeam,
            score: 0,
            wickets: 0,
            completedOvers: 0,
            totalOvers: '0',
            deliveries: [],
            allOut: false,
            complete: false,
            batting: {
                extras: {
                    byes: 0,
                    legByes: 0,
                    noBalls: 0,
                    wides: 0,
                    penaltyRuns: 0,
                },
                batters: [],
            },
            bowlers: [],
            fallOfWickets: [],
        };
        const fourInningsMatch = {
            ...match,
            innings: [...match.innings, thirdInnings, fourthInnings],
        };

        const scorecard = ReactTestRenderer.create(<Scorecard cricketMatch={fourInningsMatch} />);

        expect(scorecard.toJSON()).toMatchSnapshot();
    });
});
