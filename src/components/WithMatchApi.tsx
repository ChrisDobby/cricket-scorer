import * as React from 'react';
import matchApi from '../api/matchApi';

export default (Component: any) => (props: any) => <Component {...props} matchApi={matchApi} />;
