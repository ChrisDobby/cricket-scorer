import * as React from 'react';
import { shallow } from 'enzyme';
import { Bowler } from '../../../../components/match/inprogress/Bowler';

describe('Bowler', () => {
    const selectBowler = jest.fn();
    beforeEach(() => jest.resetAllMocks());

    it('should call selectBowler when bowler clicked', () => {
        const bowler = shallow(
            <Bowler index={0} selected={false} name="Bowler" allowed={true} selectBowler={selectBowler} />,
        );

        bowler.find('.bowler-row').at(0).simulate('click');

        expect(selectBowler).toHaveBeenCalledWith(0);
    });

    it('should not call selectBowler when disallowed and bowler clicked', () => {
        const bowler = shallow(
            <Bowler index={0} selected={false} name="Bowler" allowed={false} selectBowler={selectBowler} />,
        );

        bowler.find('.bowler-row').at(0).simulate('click');

        expect(selectBowler).toHaveBeenCalledTimes(0);
    });
});
