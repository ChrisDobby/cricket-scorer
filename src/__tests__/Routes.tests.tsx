import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import Routes from '../Routes';

describe('Routes', () => {
    it('should render correctly', () => {
        const wrapper = mount((
            <MemoryRouter initialEntries={['/']}>
                <Routes />
            </MemoryRouter>));

        expect(wrapper.find('#home-route')).toHaveLength(1);
    });
});
