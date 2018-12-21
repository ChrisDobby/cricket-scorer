import * as React from 'react';
import matchApi from '../api/matchApi';
import api from '../api/api';

export default (Component: any) => (props: any) => <Component {...props} matchApi={matchApi(api(3, 1000))} />;
