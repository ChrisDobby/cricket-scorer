import * as React from 'react';
import WithNavBar from '../components/WithNavBar';
import WithInProgressMatches from '../components/WithInProgressMatches';
import { default as HomeComponent } from '../components/Home';

const Home = (props: any) => <HomeComponent {...props} />;

export default WithNavBar({})(
    WithInProgressMatches(Home),
);
