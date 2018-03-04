import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

global.getPropTypeWarningTester = (prop, component) => new RegExp(`Failed prop type:|${prop}|${component}`, 'g');

configure({ adapter: new Adapter() });
