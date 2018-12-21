import * as React from 'react';
import { render, cleanup } from 'react-testing-library';
import WithNavBar from '../../components/WithNavBar';

describe('WithNavBar', () => {
    beforeEach(cleanup);
    const TestComponent = () => <div />;
    it('should render correctly', () => {
        const TestComponentWithNavBar = WithNavBar({})(TestComponent);
        const { container } = render(<TestComponentWithNavBar />);

        expect(container).toMatchSnapshot();
    });
});
