import * as React from 'react';
import { shallow } from 'enzyme';
import * as ReactTestRenderer from 'react-test-renderer';
import { SaveButton } from '../../../components/match/SaveButton';

describe('SaveButton', () => {
    const save = jest.fn();

    beforeEach(() => jest.resetAllMocks());

    it('should call save when clicked', () => {
        const saveButton = shallow(
            <SaveButton
                enabled={true}
                save={save}
            />);

        saveButton.find('button').at(0).simulate('click');

        expect(save).toBeCalled();
    });

    it('should render correctly when enabled', () => {
        const saveButton = ReactTestRenderer.create(<SaveButton enabled save={save} />);

        expect(saveButton.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when disabled', () => {
        const saveButton = ReactTestRenderer.create(<SaveButton enabled={false} save={save} />);

        expect(saveButton.toJSON()).toMatchSnapshot();
    });
});
