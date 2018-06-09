import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import Routes from '../Routes';
import { Scorecard } from '../components/scorecard/Scorecard';

describe('Routes', () => {
    it('should render correctly', () => {
        const wrapper = mount((
            <MemoryRouter initialEntries={['/']}>
                <Routes />
            </MemoryRouter>));

        expect(wrapper.find('#home-route')).toHaveLength(1);
    });

    it('should render scorecard route correctly', () => {
        const wrapper = mount((
            <MemoryRouter initialEntries={['/scorecard']}>
                <Routes />
            </MemoryRouter>));

        expect(wrapper.find(Scorecard)).toHaveLength(1);
    });
});
