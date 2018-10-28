import * as React from 'react';
import WithNavBar from '../components/WithNavBar';
import WithMatchApi from '../components/WithMatchApi';
import { default as HomeComponent } from '../components/Home';

const Home = (props: any) => <HomeComponent {...props} />;

export default WithNavBar(WithMatchApi(Home));
