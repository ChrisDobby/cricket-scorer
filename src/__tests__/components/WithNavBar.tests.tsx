import * as React from 'react';
import * as ReactTestRenderer from 'react-test-renderer';
import WithNavBar from '../../components/WithNavBar';

describe('WithNavBar', () => {
    const TestComponent = () => <div />;
    it('should render correctly', () => {
        const TestComponentWithNavBar = WithNavBar({})(TestComponent);
        const withNavBar = ReactTestRenderer.create(<TestComponentWithNavBar />);

        expect(withNavBar.toJSON()).toMatchSnapshot();
    });
});
