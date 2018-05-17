import * as React from 'react';
import { shallow } from 'enzyme';
import { EntryPanel } from '../../../components/match/EntryPanel';

describe('EntryPanel', () => {
    const ballFunctions = {
        dotBall: jest.fn(),
        completeOver: jest.fn(),
    };

    beforeEach(() => jest.resetAllMocks());
    it('should call dot ball when the dot ball button is clicked', () => {
        const entryPanel = shallow(<EntryPanel ballFunctions={ballFunctions} />);

        entryPanel.find('button').at(0).simulate('click');

        expect(ballFunctions.dotBall).toHaveBeenCalled();
    });
});
