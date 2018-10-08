import * as React from 'react';
import { shallow } from 'enzyme';
import * as ReactTestRenderer from 'react-test-renderer';
import { SelectBowler } from '../../../components/match/SelectBowler';
import { match } from '../../testData/testMatch';

describe('SelectBowler', () => {
    const players = [
        'Player 1',
        'Player 2',
        'Player 3',
        'Player 4',
        'Player 5',
        'Player 6',
        'Player 7',
        'Player 8',
        'Player 9',
        'Player 10',
        'Player 11',
    ];

    const team = {
        ...match.homeTeam,
        players,
    };

    const select = jest.fn();

    beforeEach(() => jest.resetAllMocks());

    const selectBowler = shallow(<SelectBowler bowlingTeam={team} selectBowler={select} disallowedPlayers={[]} />);

    it('should update state when selectBowler called', () => {
        const instance = selectBowler.instance() as SelectBowler;
        instance.selectBowler(0);

        expect(selectBowler.state().selectedPlayerIndex).toBe(0);
    });

    it('should be able to save when a player is selected', () => {
        selectBowler.setState({
            selectedPlayerIndex: 0,
        });

        const instance = selectBowler.instance() as SelectBowler;
        expect(instance.canSave).toBeTruthy();
    });

    it('should not be able to save when a player is not selected', () => {
        selectBowler.setState({
            selectedPlayerIndex: -1,
        });

        const instance = selectBowler.instance() as SelectBowler;
        expect(instance.canSave).toBeFalsy();
    });

    it('should call select func when save called if a player is selected', () => {
        selectBowler.setState({
            selectedPlayerIndex: 0,
        });

        const instance = selectBowler.instance() as SelectBowler;
        instance.save();

        expect(select).toHaveBeenCalledWith(0);
    });

    it('should not call select func when save called if no player selected', () => {
        selectBowler.setState({
            selectedPlayerIndex: -1,
        });

        const instance = selectBowler.instance() as SelectBowler;
        instance.save();

        expect(select).toHaveBeenCalledTimes(0);
    });

    it('should render correctly when no player selected', () => {
        const selectBowler = ReactTestRenderer
            .create(<SelectBowler bowlingTeam={team} selectBowler={select} disallowedPlayers={[]} />);

        expect(selectBowler.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when a player is selected', () => {
        const selectBowler = ReactTestRenderer
            .create(<SelectBowler bowlingTeam={team} selectBowler={select} disallowedPlayers={[]} />);

        selectBowler.root.instance.setState({
            selectedPlayerIndex: 6,
        });

        expect(selectBowler.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when a player is disallowed', () => {
        const selectBowler = ReactTestRenderer
            .create(<SelectBowler bowlingTeam={team} selectBowler={select} disallowedPlayers={[0]} />);

        expect(selectBowler.toJSON()).toMatchSnapshot();
    });
});
