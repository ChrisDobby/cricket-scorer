import * as React from 'react';
import { render, cleanup } from 'react-testing-library';
import WithNavBar from '../../components/WithNavBar';

describe('WithNavBar', () => {
    beforeEach(cleanup);
    const TestComponent = () => <div />;

    const defaultProps = {
        isAuthenticated: true,
        login: jest.fn(),
        logout: jest.fn(),
        outOfDateMatches: [],
        outOfDateSelected: jest.fn(),
        userProfile: {
            id: '1',
            name: 'test',
        },
    };

    it('should render correctly', () => {
        const TestComponentWithNavBar = WithNavBar({})(TestComponent);
        const { container } = render(<TestComponentWithNavBar {...defaultProps} />);

        expect(container).toMatchSnapshot();
    });
});
