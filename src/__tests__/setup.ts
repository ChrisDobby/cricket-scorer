import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

process.env.AUTH0_DOMAIN = 'domain';
process.env.AUTH0_CLIENT_ID = 'clientid';
