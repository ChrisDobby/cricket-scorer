import * as React from 'react';
import { shallow } from 'enzyme';
import { EntryPanel } from '../../../components/match/EntryPanel';

describe('EntryPanel', () => {
    const ballFunctions = {
        dotBall: jest.fn(),
        runs: jest.fn(),
        completeOver: jest.fn(),
    };

    beforeEach(() => jest.resetAllMocks());
    it('should call dot ball when the dot ball button is clicked', () => {
        const entryPanel = shallow(<EntryPanel ballFunctions={ballFunctions} />);

        entryPanel.find('button').at(0).simulate('click');

        expect(ballFunctions.dotBall).toHaveBeenCalled();
    });

    it('should call runs with 1 when the 1 run button is clicked', () => {
        const entryPanel = shallow(<EntryPanel ballFunctions={ballFunctions} />);

        entryPanel.find('button').at(1).simulate('click');

        expect(ballFunctions.runs).toHaveBeenCalledWith(1);
    });

    it('should call runs with 2 when the 2 run button is clicked', () => {
        const entryPanel = shallow(<EntryPanel ballFunctions={ballFunctions} />);

        entryPanel.find('button').at(2).simulate('click');

        expect(ballFunctions.runs).toHaveBeenCalledWith(2);
    });

    it('should call runs with 3 when the 3 run button is clicked', () => {
        const entryPanel = shallow(<EntryPanel ballFunctions={ballFunctions} />);

        entryPanel.find('button').at(3).simulate('click');

        expect(ballFunctions.runs).toHaveBeenCalledWith(3);
    });
});
