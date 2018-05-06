import React from 'react';
import { shallow } from 'enzyme';
import Notification from './index';
import Icon from '../Icon';

describe('<Notification/>', () => {
  const error = jest.spyOn(console, 'error');

  beforeEach(() => {
    error.mockReset();
  })

  test('Should render Notification component with given Title, body, and type [info] by default', () => {
    const title = 'Title';
    const content = 'content';
    const wrapper = shallow(<Notification title={title}>{content}</Notification>);
    expect(wrapper.containsMatchingElement(title)).toBeTruthy();
    expect(wrapper.containsMatchingElement(content)).toBeTruthy();
    expect(wrapper.hasClass('style--info')).toBeTruthy();
  })

  test('Should place specific class if Notification should be raised', () => {
    const title = 'Title';
    const content = 'content';
    const wrapper = shallow(<Notification raised title={title}>{content}</Notification>);
    expect(wrapper.hasClass('style--raised')).toBeTruthy();
  })

  test('Should give an ability to override default Icon', () => {
    const title = 'Title';
    const content = 'content';
    const wrapper = shallow(<Notification raised icon='clock' title={title}>{content}</Notification>);
    expect(wrapper.find(Icon).prop('g')).toEqual('clock');
  })

  test('Should forse providing [title] property', () => {
    shallow(<Notification raised >Some body</Notification>);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('title', 'Notification'));
  })

  test('Should forse providing [type] of one of predefined values', () => {
    shallow(<Notification raised type='someothertype'>Some body</Notification>);
    expect(error).toHaveBeenCalledTimes(2);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('type', 'Notification'));
  })
  
  test('Should pass all props to root element except listed in propTypes', () => {
    const wrapper = shallow(<Notification raised title='Some' type='error' foo='bar'>Some body</Notification>);
    expect(wrapper.prop('foo')).toEqual('bar');
    expect(wrapper.prop('title')).not.toEqual('Some');
  })
})